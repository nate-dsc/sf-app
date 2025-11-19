import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"

import type { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { CardSnapshot } from "@/types/database"
import { RecurringTransaction } from "@/types/transaction"
import { localToUTC } from "@/utils/DateUtils"
import {
    fetchActiveRecurringTransactions,
    fetchCardSnapshot,
    fetchRecurringRule,
    fetchRecurringTransactionsByType,
    insertRecurringOccurrence,
    insertRecurringTransaction,
    removeRecurringTransaction,
    removeRecurringTransactionCascade,
    updateCardLimitUsed,
    updateRecurringLastProcessed,
} from "../repositories/recurringTransactionRepository"

export type NotifyRecurringChargeSkipped = ReturnType<
    typeof useRecurringCreditLimitNotification
>["notifyRecurringChargeSkipped"]

export function useRecurringTransactionsModule(
    database: SQLiteDatabase,
    notifyRecurringChargeSkipped: NotifyRecurringChargeSkipped,
) {
    const createRecurringTransaction = useCallback(async (data: RecurringTransaction) => {
        try {
            await insertRecurringTransaction(database, data)

            const type = data.type ?? (data.value >= 0 ? "in" : "out")

            console.log(`Recurring transaction inserted:\nValue: ${data.value}\nDescription: ${data.description}\nCategory: ${data.category}\nStart date: ${data.date_start}\nRRULE: ${data.rrule}\nType: ${type}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const createRecurringTransactionWithCard = useCallback(async (data: RecurringTransaction, cardId: number) => {
        try {
            await insertRecurringTransaction(database, data, cardId)

            console.log(`Recurring transaction with card inserted:\nValue: ${data.value}\nDescription: ${data.description}\nCategory: ${data.category}\nStart date: ${data.date_start}\nRRULE: ${data.rrule}\nCard: ${cardId}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const deleteRecurringTransaction = useCallback(async (id: number) => {
        try {
            await removeRecurringTransaction(database, id)
        } catch (error) {
            console.error("Could not delete recurring transaction", error)
            throw error
        }
    }, [database])

    const deleteRecurringTransactionCascade = useCallback(async (id: number) => {
        try {
            await removeRecurringTransactionCascade(database, id)
        } catch (error) {
            console.error("Could not delete recurring transaction cascade", error)
            throw error
        }
    }, [database])

    const createAndSyncRecurringTransactions = useCallback(async () => {
        console.log("Syncing recurring transactions")
        const newEndOfDay = new Date()
        newEndOfDay.setHours(23, 59, 59)
        const newEndOfDayStr = newEndOfDay.toISOString().slice(0, 16)

        try {
            const allRecurringTransactions = await fetchActiveRecurringTransactions(database)

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
                    let cardSnapshot: CardSnapshot | null = null
                    if (blueprint.card_id) {
                        cardSnapshot = await fetchCardSnapshot(database, blueprint.card_id)

                        if (!cardSnapshot) {
                            console.warn(`Card ${blueprint.card_id} not found for recurrence ${blueprint.id}`)
                            continue
                        }
                    }

                    await database.withTransactionAsync(async () => {
                        let processedAny = false
                        let availableLimit = cardSnapshot ? cardSnapshot.max_limit - cardSnapshot.limit_used : null
                        const computedType = blueprint.type ?? (blueprint.value >= 0 ? "in" : "out")

                        for (const occurrence of pendingOccurrences) {
                            occurrence.setHours(0, 0, 0)

                            const shouldCheckLimit = Boolean(blueprint.card_id && availableLimit !== null && computedType === "out")
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

                            await insertRecurringOccurrence(database, {
                                value: blueprint.value,
                                description: blueprint.description,
                                category: blueprint.category,
                                date: occurrence.toISOString().slice(0, 16),
                                recurringId: blueprint.id!,
                                cardId: blueprint.card_id ?? null,
                                type: computedType,
                            })

                            processedAny = true

                            if (blueprint.card_id) {
                                const limitAdjustment = blueprint.value < 0 ? Math.abs(blueprint.value) : -Math.abs(blueprint.value)

                                if (limitAdjustment !== 0) {
                                    await updateCardLimitUsed(database, blueprint.card_id, limitAdjustment)

                                    if (availableLimit !== null) {
                                        if (limitAdjustment > 0) {
                                            availableLimit -= limitAdjustment
                                        } else {
                                            availableLimit += Math.abs(limitAdjustment)
                                        }
                                    }
                                }
                            }

                            console.log(`Recurring transaction created ${blueprint.id} on day ${occurrence.toISOString().slice(0, 16)}`)
                        }

                        if (processedAny) {
                            await updateRecurringLastProcessed(database, blueprint.id!, newEndOfDayStr)
                        }
                    })
                }
            }

            console.log("Syncing complete")
        } catch (error) {
            console.error("Fatal error during recurring transactions syncing:", error)
            throw error
        }
    }, [database, notifyRecurringChargeSkipped])

    const getRRULE = useCallback(async (id: number): Promise<string> => {
        try {
            const rule = await fetchRecurringRule(database, id)
            return rule ?? ""
        } catch (error) {
            console.error("Recurring transaction search error:", error)
            throw error
        }
    }, [database])

    const getRecurringSummaryThisMonth = useCallback(async function getRecurringSummaryThisMonth(type: "in" | "out") {
        const now = new Date()

        const startLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
        const endLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const startUTC = localToUTC(startLocal)
        const endUTC = localToUTC(endLocal)

        let totalRecurring = 0
        const categoryTotalsMap = new Map<number, number>()

        try {
            const recurringTransactions = await fetchRecurringTransactionsByType(database, type)

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
            console.log("Could not fetch recurring transactions summary")
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
