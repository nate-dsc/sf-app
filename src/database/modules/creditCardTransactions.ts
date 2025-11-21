import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"
import {
    InstallmentPurchaseInput,
    InstallmentSchedule,
    InstallmentScheduleWithStatus,
    RecurringTransaction,
    Transaction,
} from "@/types/transaction"
import { buildInstallmentSchedule, clampPurchaseDay, computeInitialPurchaseDate, formatDateTimeForSQLite, mergeScheduleWithRealized } from "@/utils/installments"
import { updateCardLimitUsed } from "../repositories/cardRepository"

export function useCreditCardTransactionsModule(database: SQLiteDatabase) {
    const createTransactionWithCard = useCallback(async (data: Transaction, cardId: number) => {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync(
                    "INSERT INTO transactions (value, description, category, date, card_id, type) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        data.value,
                        data.description,
                        Number(data.category),
                        data.date,
                        cardId,
                        data.type ?? (data.value >= 0 ? "in" : "out"),
                    ]
                )

                const limitAdjustment = data.value < 0 ? Math.abs(data.value) : -Math.abs(data.value)

                if (limitAdjustment !== 0) {
                    await updateCardLimitUsed(database, cardId, limitAdjustment)
                }
            })

            console.log(`Transação com cartão inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData: ${data.date}\nCartão: ${cardId}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const createInstallmentPurchase = useCallback(async (data: InstallmentPurchaseInput) => {
        try {
            const schedule = await database.withTransactionAsync(async () => {
                const cardSnapshot = await database.getFirstAsync<{
                    max_limit: number | null
                    limit_used: number | null
                    closing_day: number | null
                    due_day: number | null
                    ignore_weekends: number | null
                }>(
                    "SELECT max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards WHERE id = ?",
                    [data.cardId],
                )

                if (!cardSnapshot) {
                    throw new Error("CARD_NOT_FOUND")
                }

                const limitValue = Number(cardSnapshot.max_limit ?? 0)
                const limitUsed = Number(cardSnapshot.limit_used ?? 0)
                const normalizedInstallmentValue = Math.abs(data.installmentValue)
                const totalValue = normalizedInstallmentValue * data.installmentsCount
                const availableLimit = limitValue - limitUsed

                if (totalValue > availableLimit) {
                    throw new Error("INSUFFICIENT_CREDIT_LIMIT")
                }

                const firstPurchaseDate = computeInitialPurchaseDate(data.purchaseDay, cardSnapshot.closing_day ?? null)
                const normalizedPurchaseDay = clampPurchaseDay(data.purchaseDay, cardSnapshot.closing_day)
                const dueDay = typeof cardSnapshot.due_day === "number" ? cardSnapshot.due_day : normalizedPurchaseDay
                const ignoreWeekends = Boolean(cardSnapshot.ignore_weekends)

                const description = data.description.trim()
                const baseSchedule = buildInstallmentSchedule({
                    blueprintId: 0,
                    cardId: data.cardId,
                    description,
                    categoryId: Number(data.category),
                    installmentValue: normalizedInstallmentValue,
                    installmentsCount: data.installmentsCount,
                    purchaseDay: normalizedPurchaseDay,
                    dueDay,
                    ignoreWeekends,
                    firstPurchaseDate,
                })

                const rrule = new RRule({
                    freq: RRule.MONTHLY,
                    dtstart: firstPurchaseDate,
                    count: data.installmentsCount,
                })

                await database.runAsync(
                    "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        -normalizedInstallmentValue,
                        description,
                        Number(data.category),
                        baseSchedule.occurrences[0]?.purchaseDate ?? formatDateTimeForSQLite(firstPurchaseDate),
                        rrule.toString(),
                        null,
                        data.cardId,
                        1,
                        "out",
                    ],
                )

                const insertedIdRow = await database.getFirstAsync<{ id: number }>("SELECT last_insert_rowid() as id")
                const blueprintId = insertedIdRow?.id ?? 0

                await updateCardLimitUsed(database, data.cardId, totalValue)

                return {
                    ...baseSchedule,
                    id: blueprintId,
                }
            })

            console.log("Compra parcelada registrada com sucesso")
            return schedule
        } catch (error) {
            console.error("Falha ao registrar compra parcelada", error)
            throw error
        }
    }, [database])

    const getCardInstallmentSchedules = useCallback(async (cardId: number): Promise<InstallmentScheduleWithStatus[]> => {
        const blueprints = await database.getAllAsync<{
            id: number
            value: number
            description: string
            category: number
            date_start: string
            rrule: string
            due_day: number | null
            closing_day: number | null
            ignore_weekends: number | null
            category_name: string | null
        }>(
            `SELECT tr.id, tr.value, tr.description, tr.category, tr.date_start, tr.rrule, c.due_day, c.closing_day, c.ignore_weekends, cat.name as category_name
             FROM transactions_recurring tr
             JOIN cards c ON c.id = tr.card_id
             LEFT JOIN categories cat ON cat.id = tr.category
             WHERE tr.card_id = ? AND tr.is_installment = 1`,
            [cardId],
        )

        if (blueprints.length === 0) {
            return []
        }

        const schedules: InstallmentScheduleWithStatus[] = []

        for (const blueprint of blueprints) {
            const firstPurchaseDate = new Date(`${blueprint.date_start}:00Z`)
            const options = RRule.parseString(blueprint.rrule)
            options.dtstart = firstPurchaseDate
            const rule = new RRule(options)
            const installmentsCount = options.count ?? rule.all().length
            const purchaseDay = clampPurchaseDay(firstPurchaseDate.getUTCDate(), blueprint.closing_day)
            const dueDay = typeof blueprint.due_day === "number" ? blueprint.due_day : purchaseDay
            const ignoreWeekends = Boolean(blueprint.ignore_weekends)

            const baseSchedule: InstallmentSchedule = buildInstallmentSchedule({
                blueprintId: blueprint.id,
                cardId,
                description: blueprint.description ?? "",
                categoryId: Number(blueprint.category),
                installmentValue: Math.abs(blueprint.value),
                installmentsCount,
                purchaseDay,
                dueDay,
                ignoreWeekends,
                firstPurchaseDate,
            })

            const realizedRows = await database.getAllAsync<{ date: string }>(
                "SELECT date FROM transactions WHERE id_recurring = ? AND card_id = ?",
                [blueprint.id, cardId],
            )

            const realizedDates = new Set(realizedRows.map((row) => row.date))
            const merged = mergeScheduleWithRealized({
                schedule: baseSchedule,
                realizedDates,
                categoryName: blueprint.category_name ?? null,
            })

            schedules.push(merged)
        }

        return schedules
    }, [database])

    const createAndSyncInstallmentPurchases = useCallback(async () => {
        console.log("Sincronizando compras parceladas")
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 0)
        const endOfDayTimestamp = endOfDay.getTime()

        const calculateDueDate = (purchaseDate: Date, dueDay: number) => {
            const purchaseDay = purchaseDate.getDate()

            let dueYear = purchaseDate.getFullYear()
            let dueMonth = purchaseDate.getMonth()

            const daysInCurrentMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const dueDayThisMonth = Math.min(dueDay, daysInCurrentMonth)

            if (dueDayThisMonth >= purchaseDay) {
                return new Date(dueYear, dueMonth, dueDayThisMonth, 0, 0, 0, 0)
            }

            dueMonth += 1
            if (dueMonth > 11) {
                dueMonth = 0
                dueYear += 1
            }

            const daysInNextMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const adjustedDueDay = Math.min(dueDay, daysInNextMonth)

            return new Date(dueYear, dueMonth, adjustedDueDay, 0, 0, 0, 0)
        }

        try {
            const installmentBlueprints = await database.getAllAsync<RecurringTransaction>(
                "SELECT * FROM transactions_recurring WHERE is_installment = 1"
            )

            if (installmentBlueprints.length === 0) {
                return
            }

            for (const blueprint of installmentBlueprints) {
                if (!blueprint.card_id) {
                    console.warn(`Compra parcelada ${blueprint.id} sem cartão associado foi ignorada.`)
                    continue
                }

                const card = await database.getFirstAsync<{
                    due_day: number
                }>("SELECT due_day FROM cards WHERE id = ?", [blueprint.card_id])

                if (!card) {
                    console.warn(`Cartão ${blueprint.card_id} não encontrado para compra parcelada ${blueprint.id}`)
                    continue
                }

                const rruleOptions = RRule.parseString(blueprint.rrule)
                rruleOptions.dtstart = new Date(`${blueprint.date_start}Z`)
                const rrule = new RRule(rruleOptions)
                const allOccurrences = rrule.all()

                const existingCountRow = await database.getFirstAsync<{ total: number }>(
                    "SELECT COUNT(*) as total FROM transactions WHERE id_recurring = ?",
                    [blueprint.id]
                )

                let generatedCount = existingCountRow?.total ?? 0

                if (generatedCount >= allOccurrences.length) {
                    continue
                }

                await database.withTransactionAsync(async () => {
                    for (let index = generatedCount; index < allOccurrences.length; index++) {
                        const occurrence = new Date(allOccurrences[index].getTime())
                        occurrence.setHours(0, 0, 0, 0)

                        const dueDate = calculateDueDate(occurrence, card.due_day)

                        if (dueDate.getTime() > endOfDayTimestamp) {
                            break
                        }

                        const dueDateStr = formatDateTimeForSQLite(dueDate)

                        await database.runAsync(
                            "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            [
                                blueprint.value,
                                blueprint.description,
                                blueprint.category,
                                dueDateStr,
                                blueprint.id,
                                blueprint.card_id ?? null,
                                blueprint.type ?? (blueprint.value >= 0 ? "in" : "out"),
                            ]
                        )

                        await database.runAsync(
                            "UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
                            [dueDateStr, blueprint.id]
                        )

                        generatedCount += 1
                    }
                })
            }

            console.log("Sincronização de compras parceladas concluída")
        } catch (error) {
            console.error("Erro ao sincronizar compras parceladas:", error)
            throw error
        }
    }, [database])

    return useMemo(() => ({
        createTransactionWithCard,
        createInstallmentPurchase,
        getCardInstallmentSchedules,
        createCard,
        getCards,
        getCard,
        updateCard,
        deleteCard,
        getCardStatementForDate,
        getCardStatementHistory,
        getCardsStatementSummaries,
        createAndSyncInstallmentPurchases,
    }), [
        createAndSyncInstallmentPurchases,
        createCard,
        createInstallmentPurchase,
        createTransactionWithCard,
        deleteCard,
        getCard,
        getCardInstallmentSchedules,
        getCardStatementForDate,
        getCardStatementHistory,
        getCards,
        getCardsStatementSummaries,
        updateCard,
    ])
}
