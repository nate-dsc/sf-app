import { Transaction } from "@/types/Transactions"
import { formatDateToDBString, formatUTCtoRecurrenceDate, prepareOccurrenceDateDBString, shouldProcessAgain } from "@/utils/RecurrenceDateUtils"
import { SQLiteDatabase } from "expo-sqlite"
import { RRule } from "rrule"
import { fetchRecurringTransactions, insertRecurringOcurrence, setRecurringLastProcessed } from "../repositories/RecurringTransactionRepository"

export async function createAndSyncRecurringTransactionsCore(database: SQLiteDatabase, now: Date = new Date()) {
        console.log("[RT Module] Syncing recurring transactions...")

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
                        await setRecurringLastProcessed(database, recurringTransaction.id, nowDB)
                    })
                }
            }
            console.log("[RT Module] Recurring transactions syncing complete")
        } catch (error) {
            console.error("[RT Module] Could not sync recurring transactions", error)
            throw error
        }
    }