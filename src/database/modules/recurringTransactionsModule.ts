import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"

import {
    fetchRecurringRule,
    fetchRecurringTransactions,
    fetchRecurringTransactionsByType,
    insertRecurringOcurrence,
    insertRecurringTransaction,
    removeRecurringTransaction,
    removeRecurringTransactionCascade,
    updateRecurringLastProcessed
} from "@/database/repositories/RecurringTransactionRepository"
import { RecurringTransaction, Transaction } from "@/types/Transactions"
import { localToUTC } from "@/utils/DateUtils"
import { formatDateToDBString, formatUTCtoRecurrenceDate, prepareOccurrenceDateDBString, shouldProcessAgain } from "@/utils/RecurrenceDateUtils"


export function useRecurringTransactionsModule(database: SQLiteDatabase) {

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
        console.log("[RT Module] Syncing recurring transactions...")

        const now = new Date()
        const nowDB = formatDateToDBString(now)

        const today = formatUTCtoRecurrenceDate(now)

        try {
            const allRecurringTransactions = await fetchRecurringTransactions(database)

            if (allRecurringTransactions.length === 0) {
                console.log("[RT Module] There are no recurring transactions")
                return
            }

            for (const recurringTransaction of allRecurringTransactions) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = formatUTCtoRecurrenceDate(recurringTransaction.date_start)
                const rrule = new RRule(rruleOptions)

                console.log("[RT Module] Processing recurrence:", rrule.toString().split('\n').at(-1))

                if(recurringTransaction.date_last_processed) {
                    const lastProcessedDate = new Date(`${recurringTransaction.date_last_processed}Z`)
                    if(!shouldProcessAgain(lastProcessedDate, now)) {
                        console.log("[RT Module] Should not process again")
                        continue
                    }
                }

                const startDateForCheck = recurringTransaction.date_last_processed ?
                formatUTCtoRecurrenceDate(recurringTransaction.date_last_processed) :
                formatUTCtoRecurrenceDate(recurringTransaction.date_start)

                console.log("[RT Module] date_start:", recurringTransaction.date_start)
                console.log("[RT Module] date_last_processed:", recurringTransaction.date_last_processed)
                console.log("[RT Module] startDateForCheck:", startDateForCheck)
                console.log("[RT Module] today:", today)

                const pendingOccurrences = rrule.between(startDateForCheck, today, true)

                if(pendingOccurrences.length === 0) {
                    console.log("[RT Module] There are no pending recurring transaction occurrences")
                    return
                }

                for(const occurrence of pendingOccurrences) {
                    console.log("[RT Module] Pending occurrence:", occurrence)
                    
                    const generatedDate = prepareOccurrenceDateDBString(occurrence)
                    console.log("[RT Module] Generated date:", generatedDate)

                    const generatedTransaction: Transaction = {
                        id: 0,
                        value: recurringTransaction.value,
                        description: recurringTransaction.description,
                        category: recurringTransaction.category,
                        date: generatedDate,
                        id_recurring: recurringTransaction.id,
                        card_id: recurringTransaction.card_id,
                        type: recurringTransaction.type
                    }

                    await database.withTransactionAsync(async () => {
                        await insertRecurringOcurrence(database, generatedTransaction, recurringTransaction.id)
                        await updateRecurringLastProcessed(database, recurringTransaction.id, nowDB)
                    })
                }
            }
            console.log("[RT Module] Recurring transactions syncing complete")
        } catch (error) {
            console.error("[RT Module] Could not sync recurring transactions", error)
            throw error
        }
    }, [])

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
