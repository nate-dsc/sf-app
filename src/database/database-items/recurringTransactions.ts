import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"

import type { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { localToUTC } from "@/utils/DateUtils"
import { RecurringTransaction } from "@/types/transaction"

export type NotifyRecurringChargeSkipped = ReturnType<
    typeof useRecurringCreditLimitNotification
>["notifyRecurringChargeSkipped"]

export function useRecurringTransactionsModule(
    database: SQLiteDatabase,
    notifyRecurringChargeSkipped: NotifyRecurringChargeSkipped,
) {
    const createRecurringTransaction = useCallback(async (data: RecurringTransaction) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, account_id, flow, notes, is_installment) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed, $card_id, $account_id, $flow, $notes, $is_installment)"
        )

        const flow = data.flow ?? (data.value >= 0 ? "inflow" : "outflow")

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date_start: data.date_start,
                $rrule: data.rrule,
                $date_last_processed: null,
                $card_id: data.card_id ?? null,
                $account_id: data.account_id ?? null,
                $flow: flow,
                $notes: data.notes ?? null,
                $is_installment: data.is_installment ?? 0,
            })

            console.log(`Transação recorrente inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}\nFluxo: ${flow}`)
        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const createRecurringTransactionWithCard = useCallback(async (data: RecurringTransaction, cardId: number) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, account_id, flow, notes, is_installment) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed, $card_id, $account_id, $flow, $notes, $is_installment)"
        )

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date_start: data.date_start,
                $rrule: data.rrule,
                $date_last_processed: null,
                $card_id: cardId,
                $account_id: data.account_id ?? null,
                $flow: data.flow ?? (data.value >= 0 ? "inflow" : "outflow"),
                $notes: data.notes ?? null,
                $is_installment: data.is_installment ?? 0,
            })

            console.log(`Transação recorrente com cartão inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}\nCartão: ${cardId}`)
        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const deleteRecurringTransaction = useCallback(async (id: number) => {
        try {
            await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete recurring transaction", error)
            throw error
        }
    }, [database])

    const deleteRecurringTransactionCascade = useCallback(async (id: number) => {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [id])
                await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
            })
        } catch (error) {
            console.error("Could not delete recurring transaction cascade", error)
            throw error
        }
    }, [database])

    const createAndSyncRecurringTransactions = useCallback(async () => {
        console.log("Iniciando criação e sincronização de transações recorrentes")
        const newEndOfDay = new Date()
        newEndOfDay.setHours(23, 59, 59)
        const newEndOfDayStr = newEndOfDay.toISOString().slice(0, 16)

        try {
            const allRecurringTransactions = await database.getAllAsync<RecurringTransaction>(
                "SELECT * FROM transactions_recurring WHERE is_installment = 0 OR is_installment IS NULL"
            )

            if (allRecurringTransactions.length === 0) {
                console.log("Não há transações recorrentes")
                return
            }

            for (const blueprint of allRecurringTransactions) {
                const rruleOptions = RRule.parseString(blueprint.rrule)
                rruleOptions.dtstart = new Date(`${blueprint.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const startDateForCheck = blueprint.date_last_processed ? new Date(`${blueprint.date_last_processed}Z`) : new Date(`${blueprint.date_start}Z`)
                const pendingOccurrences = rrule.between(startDateForCheck, newEndOfDay, true)

                if (pendingOccurrences.length > 0) {
                    let cardSnapshot: { limit: number; limit_used: number; name: string | null } | null = null
                    if (blueprint.card_id) {
                        cardSnapshot = await database.getFirstAsync<{ limit: number; limit_used: number; name: string | null }>(
                            "SELECT limit, limit_used, name FROM cards WHERE id = ?",
                            [blueprint.card_id]
                        )

                        if (!cardSnapshot) {
                            console.warn(`Cartão ${blueprint.card_id} não encontrado para recorrência ${blueprint.id}`)
                            continue
                        }
                    }

                    await database.withTransactionAsync(async () => {
                        let processedAny = false
                        let availableLimit = cardSnapshot ? cardSnapshot.limit - cardSnapshot.limit_used : null
                        const computedFlow = blueprint.flow ?? (blueprint.value >= 0 ? "inflow" : "outflow")

                        for (const occurrence of pendingOccurrences) {
                            occurrence.setHours(0, 0, 0)

                            const shouldCheckLimit = Boolean(blueprint.card_id && availableLimit !== null && computedFlow === "outflow")
                            const requiredAmount = Math.abs(blueprint.value)

                            if (shouldCheckLimit && availableLimit !== null && requiredAmount > availableLimit) {
                                notifyRecurringChargeSkipped({
                                    cardId: blueprint.card_id!,
                                    cardName: cardSnapshot?.name ?? null,
                                    attemptedAmount: requiredAmount,
                                    availableLimit,
                                })
                                break
                            }

                            await database.runAsync(
                                "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, account_id, flow, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [
                                    blueprint.value,
                                    blueprint.description,
                                    blueprint.category,
                                    occurrence.toISOString().slice(0, 16),
                                    blueprint.id,
                                    blueprint.card_id ?? null,
                                    blueprint.account_id ?? null,
                                    computedFlow,
                                    blueprint.notes ?? null,
                                ]
                            )

                            processedAny = true

                            if (blueprint.card_id) {
                                const limitAdjustment = blueprint.value < 0 ? Math.abs(blueprint.value) : -Math.abs(blueprint.value)

                                if (limitAdjustment !== 0) {
                                    await database.runAsync(
                                        "UPDATE cards SET limit_used = limit_used + ? WHERE id = ?",
                                        [limitAdjustment, blueprint.card_id]
                                    )

                                    if (availableLimit !== null) {
                                        if (limitAdjustment > 0) {
                                            availableLimit -= limitAdjustment
                                        } else {
                                            availableLimit += Math.abs(limitAdjustment)
                                        }
                                    }
                                }
                            }

                            console.log(`Criada transação da transação recorrente ${blueprint.id} no dia ${occurrence.toISOString().slice(0, 16)}`)
                        }

                        if (processedAny) {
                            await database.runAsync(
                                "UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
                                [newEndOfDayStr, blueprint.id]
                            )
                        }
                    })
                }
            }

            console.log("Sincronização concluída.")
        } catch (error) {
            console.error("Erro fatal durante a sincronização de transações recorrentes:", error)
            throw error
        }
    }, [database, notifyRecurringChargeSkipped])

    const getRRULE = useCallback(async (id: number): Promise<string> => {
        try {
            const parentTransaction = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring WHERE id = ?", [id])
            return parentTransaction[0].rrule
        } catch (error) {
            console.error("Erro na busca por transação recorrente:", error)
            throw error
        }
    }, [database])

    const getRecurringSummaryThisMonth = useCallback(async (flowType: "inflow" | "outflow") => {
        const now = new Date()

        const startLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
        const endLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const startUTC = localToUTC(startLocal)
        const endUTC = localToUTC(endLocal)

        let totalRecurring = 0
        const categoryTotalsMap = new Map<number, number>()

        const query = flowType === "outflow" ? "SELECT * FROM transactions_recurring WHERE flow = 'outflow'" : "SELECT * FROM transactions_recurring WHERE flow = 'inflow'"

        try {
            const recurringTransactions = await database.getAllAsync<RecurringTransaction>(query)

            for (const recurringTransaction of recurringTransactions) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = new Date(`${recurringTransaction.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const pendingOccurrences = rrule.between(startUTC, endUTC, true)

                if (pendingOccurrences.length > 0) {
                    const transactionTotal = recurringTransaction.value * pendingOccurrences.length
                    totalRecurring += transactionTotal

                    const currentCategoryTotal = categoryTotalsMap.get(recurringTransaction.category) ?? 0
                    categoryTotalsMap.set(recurringTransaction.category, currentCategoryTotal + transactionTotal)
                }
            }

            const categoryTotals: Record<number, number> = {}

            categoryTotalsMap.forEach((value, key) => {
                categoryTotals[key] = value
            })

            return { totalRecurring, recurringTransactions, categoryTotals }
        } catch (error) {
            console.log("Não foi possível recuperar o sumário das transações recorrentes")
            throw error
        }
    }, [database])

    return useMemo(() => ({
        createRecurringTransaction,
        createRecurringTransactionWithCard,
        deleteRecurringTransaction,
        deleteRecurringTransactionCascade,
        createAndSyncRecurringTransactions,
        getRRULE,
        getRecurringSummaryThisMonth,
    }), [
        createRecurringTransaction,
        createRecurringTransactionWithCard,
        deleteRecurringTransaction,
        deleteRecurringTransactionCascade,
        createAndSyncRecurringTransactions,
        getRRULE,
        getRecurringSummaryThisMonth,
    ])
}
