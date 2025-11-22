import { useCreditCardModule } from "@/database/modules/CreditCardModule"
import { insertInstallmentPurchase } from "@/database/repositories/CCInstallmentsRepository"
import { InstallmentPurchase } from "@/types/CreditCards"
import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback } from "react"

export function useCreditCardInstallmentsModule(database: SQLiteDatabase) {
    const { getCard } = useCreditCardModule(database)

    const createInstallmentPurchase = useCallback(async (data: InstallmentPurchase) => {

        if(data.transaction.card_id) {
            try {
                const card = await getCard(data.transaction.card_id)
                if(!card) return
                const availableLimit = card.maxLimit - card.limitUsed
                const limitToBeUsed = Math.abs(data.transaction.value * data.installmentCounts)
                if (availableLimit >= limitToBeUsed) {
                    await insertInstallmentPurchase(database, data.transaction, data.transaction.card_id, limitToBeUsed)
                }
            } catch (err) {
                console.error(`[CC Installments Module] Could not insert installment purchase`, err)
            }
        }
    },[])

    return {createInstallmentPurchase}
        
}

/**
 * try {

            const limitToBeUsed = Math.abs(data.transaction.value * data.installmentCounts)

            const schedule = await database.withTransactionAsync(async () => {
                const cardSnapshot = await fetchCardInstallmentSnapshot(database, data.cardId)

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

                await insertInstallmentRecurringTransaction(database, {
                    value: -normalizedInstallmentValue,
                    description,
                    categoryId: Number(data.category),
                    dateStart: baseSchedule.occurrences[0]?.purchaseDate ?? formatDateTimeForSQLite(firstPurchaseDate),
                    rrule: rrule.toString(),
                    cardId: data.cardId,
                })

                const blueprintId = await fetchLastInsertedRecurringId(database)

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
        const blueprints = await fetchInstallmentBlueprintsWithCardDetails(database, cardId)

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

            const realizedRows = await fetchRecurringOccurrencesDates(database, blueprint.id, cardId)

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
            const installmentBlueprints = await fetchInstallmentRecurringTransactions(database)

            if (installmentBlueprints.length === 0) {
                return
            }

            for (const blueprint of installmentBlueprints) {
                if (!blueprint.card_id) {
                    console.warn(`Compra parcelada ${blueprint.id} sem cartão associado foi ignorada.`)
                    continue
                }

                const card = await fetchCardDueDay(database, blueprint.card_id)

                if (!card) {
                    console.warn(`Cartão ${blueprint.card_id} não encontrado para compra parcelada ${blueprint.id}`)
                    continue
                }

                const rruleOptions = RRule.parseString(blueprint.rrule)
                rruleOptions.dtstart = new Date(`${blueprint.date_start}Z`)
                const rrule = new RRule(rruleOptions)
                const allOccurrences = rrule.all()

                let generatedCount = await fetchRecurringTransactionsCount(database, blueprint.id)

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

                        await insertTransactionWithCard(
                            database,
                            {
                                ...blueprint,
                                date: dueDateStr,
                                id_recurring: blueprint.id,
                                card_id: blueprint.card_id,
                            },
                            blueprint.card_id as number,
                        )

                        await updateRecurringLastProcessed(database, blueprint.id, dueDateStr)

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
        createInstallmentPurchase,
        getCardInstallmentSchedules,
        createAndSyncInstallmentPurchases,
    }), [
        createAndSyncInstallmentPurchases,
        createInstallmentPurchase,
    ])
 */
