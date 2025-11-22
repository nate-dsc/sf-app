import { RecurringTransaction, Transaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

import { useCreditCardModule } from "@/database/modules/CreditCardModule";
import { fetchRecurringTransactionsWithCard, insertCardTransactionRecurring, insertCardTransactionRecurringOcurrence, updateRecurringTransactionsWithCardLastProcessed } from "@/database/repositories/CCTransactionsRecurringRepository";
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
                console.error(`[CC Transactions Recurring Module] Could not insert recurring credit card transaction`, err)
            }
        }
    },[])

    const createAndSyncRecurringTransactionsWithCard = useCallback(async () => {
        console.log("[CC Recurring Transactions Module] Syncing recurring transactions...")
        
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59)
        const endOfDayISOsliced = endOfDay.toISOString().slice(0,16)
        const endOfDayISO = new Date(`${endOfDayISOsliced}Z`)

        try {
            const allRecurringTransactionsWithCard = await fetchRecurringTransactionsWithCard(database)

            if(allRecurringTransactionsWithCard.length === 0) {
                console.log("[CC Recurring Transactions Module] There are no recurring transactions")
                return
            }

            for(const recurringTransaction of allRecurringTransactionsWithCard) {
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
                        type: "out"
                    }

                    const card = await getCard(recurringTransaction.card_id!)
                    if(!card) {

                        console.log("[CC Recurring Transactions Module] Could not find the credit card")
                        return

                    }
                    const availableLimit = card.maxLimit - card.limitUsed
                    if (availableLimit >= recurringTransaction.value) {
                        
                        await database.withTransactionAsync(async () => {
                            await insertCardTransactionRecurringOcurrence(database, generatedTransaction, recurringTransaction.id, card.id)
                            await updateCardLimitUsed(database, card.id, recurringTransaction.value)
                            await updateRecurringTransactionsWithCardLastProcessed(database, recurringTransaction.id, localEndOfDayISO)
                        })

                    } else {

                        console.log("[CC Recurring Transactions Module] Not enough limit for recurring transaction occurrence")
                        return

                    }
                }
            }
            console.log("[CC Recurring Transactions Module] Recurring transactions with card syncing complete")
        } catch (err) {
            console.error("[CC Recurring Transactions Module] Could not sync recurring transactions with card", err)
            throw err
        }
    },[])

    return { createRecurringTransactionWithCard, createAndSyncRecurringTransactionsWithCard }
}