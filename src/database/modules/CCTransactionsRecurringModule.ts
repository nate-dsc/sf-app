import { RecurringTransaction, Transaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

import { useCreditCardModule } from "@/database/modules/CreditCardModule";
import { fetchRecurringTransactionsWithCard, insertCardTransactionRecurring, insertCardTransactionRecurringOcurrence, updateRecurringTransactionsWithCardLastProcessed } from "@/database/repositories/CCTransactionsRecurringRepository";
import { formatDateToDBString, formatUTCtoRecurrenceDate, prepareOccurrenceDateDBString, shouldProcessAgain } from "@/utils/RecurrenceDateUtils";
import { RRule } from "rrule";
import { updateCardLimitUsed } from "../repositories/CreditCardRepository";

export function useCCTransactionsRecurringModule(database: SQLiteDatabase) {
    const { getCard } = useCreditCardModule(database)

    const createRecurringTransactionWithCard = useCallback(async (data: RecurringTransaction) => {
        if(data.card_id) {
            try {
                const card = await getCard(data.card_id)
                if(!card) return
                const availableLimit = card.maxLimit - card.limitUsed
                if (availableLimit >= data.value) {
                    await insertCardTransactionRecurring(database, data, data.card_id)
                }
            } catch (err) {
                console.error(`[CC RT Module] Could not insert recurring credit card transaction`, err)
            }
        }
    },[])

    const createAndSyncRecurringTransactionsWithCard = useCallback(async () => {
        console.log("[CC RT Module] Syncing recurring transactions...")
    
        const now = new Date()
        const nowDB = formatDateToDBString(now)

        const today = formatUTCtoRecurrenceDate(now)

        try {
            const allRecurringTransactionsWithCard = await fetchRecurringTransactionsWithCard(database)

            if(allRecurringTransactionsWithCard.length === 0) {
                console.log("[CC RT Module] There are no recurring transactions")
                return
            }

            for(const recurringTransaction of allRecurringTransactionsWithCard) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = formatUTCtoRecurrenceDate(recurringTransaction.date_start)
                const rrule = new RRule(rruleOptions)

                console.log("[CC RT Module] Processing recurrence:", rrule.toString().split('\n').at(-1))

                if(recurringTransaction.date_last_processed) {
                    const lastProcessedDate = new Date(`${recurringTransaction.date_last_processed}Z`)
                    if(!shouldProcessAgain(lastProcessedDate, now)) {
                        console.log("[CC RT Module] Should not process again")
                        continue
                    }
                }

                const startDateForCheck = recurringTransaction.date_last_processed ?
                formatUTCtoRecurrenceDate(recurringTransaction.date_last_processed) :
                formatUTCtoRecurrenceDate(recurringTransaction.date_start)

                console.log("[CC RT Module] date_start:", recurringTransaction.date_start)
                console.log("[CC RT Module] date_last_processed:", recurringTransaction.date_last_processed)
                console.log("[CC RT Module] startDateForCheck:", startDateForCheck)
                console.log("[CC RT Module] today:", today)

                const pendingOccurrences = rrule.between(startDateForCheck, today, true)

                if(pendingOccurrences.length === 0) {
                    console.log("[CC RT Module] There are no pending recurring transaction occurrences")
                    return
                }

                for(const occurrence of pendingOccurrences) {
                    console.log("[CC RT Module] Pending occurrence:", occurrence)

                    const generatedDate = prepareOccurrenceDateDBString(occurrence)
                    console.log("[CC RT Module] Generated date:", generatedDate)

                    const generatedTransaction: Transaction = {
                        id: 0,
                        value: recurringTransaction.value,
                        description: recurringTransaction.description,
                        category: recurringTransaction.category,
                        date: generatedDate,
                        id_recurring: recurringTransaction.id,
                        card_id: recurringTransaction.card_id,
                        type: "out"
                    }

                    const card = await getCard(recurringTransaction.card_id!)
                    if(!card) {

                        console.log("[CC RT Module] Could not find the credit card")
                        return

                    }
                    const availableLimit = card.maxLimit - card.limitUsed
                    if (availableLimit >= recurringTransaction.value) {
                        
                        await database.withTransactionAsync(async () => {
                            await insertCardTransactionRecurringOcurrence(database, generatedTransaction, recurringTransaction.id, card.id)
                            await updateCardLimitUsed(database, card.id, recurringTransaction.value)
                            await updateRecurringTransactionsWithCardLastProcessed(database, recurringTransaction.id, nowDB)
                        })

                    } else {

                        console.log("[CC RT Module] Not enough limit for recurring transaction occurrence")
                        return

                    }
                }
            }
            console.log("[CC RT Module] Recurring transactions with card syncing complete")
        } catch (err) {
            console.error("[CC RT Module] Could not sync recurring transactions with card", err)
            throw err
        }
    },[])

    return { createRecurringTransactionWithCard, createAndSyncRecurringTransactionsWithCard }
}