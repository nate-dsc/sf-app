import { useCreditCardModule } from "@/database/modules/CreditCardModule"
import {
    fetchActiveInstallments,
    insertInstallmentPurchase
} from "@/database/repositories/CCInstallmentsRepository"
import { InstallmentPurchase } from "@/types/CreditCards"
import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback } from "react"
import { RRule } from "rrule"

export function useCCInstallmentsModule(database: SQLiteDatabase) {
    const { getCard } = useCreditCardModule(database)

    const createInstallmentPurchase = useCallback(async (data: InstallmentPurchase) => {
        if (data.transaction.card_id) {
            try {
                const card = await getCard(data.transaction.card_id)
                if (!card) return
                const availableLimit = card.maxLimit - card.limitUsed
                const limitToBeUsed = Math.abs(data.transaction.value * data.installmentCount)
                if (availableLimit >= limitToBeUsed) {
                    await insertInstallmentPurchase(database, data.transaction, data.transaction.card_id, limitToBeUsed)
                }
            } catch (err) {
                console.error(`[CC Installments Module] Could not insert installment purchase`, err)
            }
        }
    }, [])

    const createAndSyncInstallments = useCallback(async () => {
        console.log("[CC Installments Module] Syncing installments")

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59)
        const endOfDayISOsliced = endOfDay.toISOString().slice(0,16)
        const endOfDayISO = new Date(`${endOfDayISOsliced}Z`)

        try {
            const allActiveInstallments = await fetchActiveInstallments(database)

            if(allActiveInstallments.length === 0) {
                console.log("[CC Installments Module] There are no active installments")
                return
            }

            for(const installment of allActiveInstallments) {
                const rruleOptions = RRule.parseString(installment.rrule)
                rruleOptions.dtstart = new Date(`${installment.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const startDateForCheck = installment.date_last_processed ?
                    new Date(`${installment.date_last_processed}Z`) :
                    new Date(`${installment.date_start}Z`)
                const pendingOccurrences = rrule.between(startDateForCheck, endOfDayISO, true)

                for(const occurrence in pendingOccurrences) {
                    console.log(occurrence)
                }
            }
            console.log("[CC Installments Module] Syncing installments complete")
        } catch (err) {
            console.error("[CC Installments Module] Could not sync pending installments")
            throw err
        }
    },[])

    /* const createAndSyncInstallmentPurchases = useCallback(async () => {
        console.log("[CC Installments Module] Syncing installment purchases")

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 0)
        const endOfDayTimestamp = endOfDay.getTime()

        const calculateDueDate = (purchaseDate: Date, dueDay: number, ignoreWeekends?: number | null) => {
            const purchaseDay = purchaseDate.getDate()

            let dueYear = purchaseDate.getFullYear()
            let dueMonth = purchaseDate.getMonth()

            const daysInCurrentMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const dueDayThisMonth = Math.min(dueDay || purchaseDay, daysInCurrentMonth)

            if (dueDayThisMonth < purchaseDay) {
                dueMonth += 1
                if (dueMonth > 11) {
                    dueMonth = 0
                    dueYear += 1
                }
            }

            const daysInTargetMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const normalizedDay = Math.min(dueDay || purchaseDay, daysInTargetMonth)
            const baseDueDate = new Date(dueYear, dueMonth, normalizedDay, 0, 0, 0, 0)

            if (!ignoreWeekends) {
                return baseDueDate
            }

            const weekDay = baseDueDate.getDay()
            if (weekDay === 0) {
                baseDueDate.setDate(baseDueDate.getDate() + 1)
            } else if (weekDay === 6) {
                baseDueDate.setDate(baseDueDate.getDate() + 2)
            }

            return baseDueDate
        }

        try {
            const installmentBlueprints = await fetchInstallmentRecurringTransactions(database)

            if (installmentBlueprints.length === 0) {
                return
            }

            for (const blueprint of installmentBlueprints) {
                if (!blueprint.card_id) {
                    console.warn(`Installment purchase ${blueprint.id} without card was ignored.`)
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

                        const dueDate = calculateDueDate(occurrence, blueprint.due_day ?? occurrence.getDate(), blueprint.ignore_weekends)

                        if (dueDate.getTime() > endOfDayTimestamp) {
                            break
                        }

                        const dueDateStr = formatDateTimeForSQLite(dueDate)

                        await insertInstallmentOccurrence(
                            database,
                            { ...blueprint, date: dueDateStr },
                            blueprint.card_id!,
                        )

                        await updateInstallmentLastProcessed(database, blueprint.id, dueDateStr)

                        generatedCount += 1
                    }
                })
            }

            console.log("Installment purchases sync finished")
        } catch (error) {
            console.error("Could not sync installment purchases", error)
            throw error
        }
    }, [database])
 */
    return { createInstallmentPurchase, createAndSyncInstallments }

}
