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
        console.log("[Recurring Transactions Module] Syncing recurring transactions...")

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59)
        const endOfDayISOsliced = endOfDay.toISOString().slice(0,16)
        const endOfDayISO = new Date(`${endOfDayISOsliced}Z`)

        try {
            const allRecurringTransactions = await fetchRecurringTransactions(database)

            if (allRecurringTransactions.length === 0) {
                console.log("[Recurring Transactions Module] There are no recurring transactions")
                return
            }

            for (const recurringTransaction of allRecurringTransactions) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = new Date(`${recurringTransaction.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const startDateForCheck = recurringTransaction.date_last_processed ?
                    new Date(`${recurringTransaction.date_last_processed}Z`) :
                    new Date(`${recurringTransaction.date_start}Z`)
                const pendingOccurrences = rrule.between(startDateForCheck, endOfDayISO, true)

                if(pendingOccurrences.length === 0) {
                    console.log("[Recurring Transactions Module] There are no pending recurring transaction occurrences")
                    return
                }

                for(const occurrence of pendingOccurrences) {
                    console.log(occurrence)

                    const local = new Date(
                        occurrence.getTime() - occurrence.getTimezoneOffset() * 60000
                    )

                    local.setHours(0,0,0)
                    const localStartOfDayISO = local.toISOString().slice(0,16)

                    local.setHours(23,59,59)
                    const localEndOfDayISO = local.toISOString().slice(0,16)

                    console.log(localStartOfDayISO)
                    console.log(localEndOfDayISO)

                    const generatedTransaction: Transaction = {
                        id: 0,
                        value: recurringTransaction.value,
                        description: recurringTransaction.description,
                        category: recurringTransaction.category,
                        date: localStartOfDayISO,
                        id_recurring: recurringTransaction.id,
                        card_id: recurringTransaction.card_id,
                        type: recurringTransaction.type
                    }

                    await database.withTransactionAsync(async () => {
                        await insertRecurringOcurrence(database, generatedTransaction, recurringTransaction.id)
                        await updateRecurringLastProcessed(database, recurringTransaction.id, localEndOfDayISO)
                    })
                }
            }
            console.log("[Recurring Transactions Module] Recurring transactions syncing complete")
        } catch (error) {
            console.error("[Recurring Transactions Module] Could not sync recurring transactions", error)
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
