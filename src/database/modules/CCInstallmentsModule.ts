import { useCreditCardModule } from "@/database/modules/CreditCardModule"
import {
    fetchActiveInstallments,
    insertInstallmentOccurrence,
    insertInstallmentPurchase,
    updateInstallmentLastProcessed
} from "@/database/repositories/CCInstallmentsRepository"
import { InstallmentPurchase } from "@/types/CreditCards"
import { Transaction } from "@/types/Transactions"
import { formatDateToDBString, formatUTCtoRecurrenceDate, prepareOccurrenceDateDBString, shouldProcessAgain } from "@/utils/RecurrenceDateUtils"
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

                console.log(`[CC Installments Module] Created installment\nValue:${data.transaction.value}\nCount:${data.installmentCount}\nRRULE:${data.transaction.rrule}`)
            } catch (err) {
                console.error(`[CC Installments Module] Could not insert installment purchase`, err)
            }
        }
    }, [])

    const createAndSyncInstallments = useCallback(async () => {
        console.log("[CC Installments Module] Syncing installments...")

        const now = new Date()
        const nowDB = formatDateToDBString(now)

        const today = formatUTCtoRecurrenceDate(now)

        try {
            const allActiveInstallments = await fetchActiveInstallments(database)

            if(allActiveInstallments.length === 0) {
                console.log("[CC Installments Module] There are no active installments")
                return
            }

            for(const installment of allActiveInstallments) {
                const rruleOptions = RRule.parseString(installment.rrule)
                rruleOptions.dtstart = formatUTCtoRecurrenceDate(installment.date_start)
                const rrule = new RRule(rruleOptions)

                console.log("[CC Installments Module] Processing recurrence:", rrule.toString().split('\n').at(-1))

                if(installment.date_last_processed) {
                    const lastProcessedDate = new Date(`${installment.date_last_processed}Z`)
                    if(!shouldProcessAgain(lastProcessedDate, now)) {
                        console.log("[CC RT Module] Should not process again")
                        continue
                    }
                }

                const startDateForCheck = installment.date_last_processed ?
                formatUTCtoRecurrenceDate(installment.date_last_processed) :
                formatUTCtoRecurrenceDate(installment.date_start)

                console.log("[CC Installments Module] date_start:", installment.date_start)
                console.log("[CC Installments Module] date_last_processed:", installment.date_last_processed)
                console.log("[CC Installments Module] startDateForCheck:", startDateForCheck)
                console.log("[CC Installments Module] today:", today)

                const pendingOccurrences = rrule.between(startDateForCheck, today, true)

                if(pendingOccurrences.length === 0) {
                    console.log("[CC Installments Module] There are no pending installment occurrences")
                    return
                }

                for(const occurrence of pendingOccurrences) {
                    console.log("[CC Installments Module] Pending occurrence:", occurrence)
                    
                    const generatedDate = prepareOccurrenceDateDBString(occurrence)
                    console.log("[CC Installments Module] Generated date:", generatedDate)


                    const installmentTransaction: Transaction = {
                        id: 0,
                        value: installment.value,
                        description: installment.description,
                        category: installment.category,
                        date: generatedDate,
                        id_recurring: installment.id,
                        card_id: installment.card_id,
                        type: "out"
                    }

                    await database.withTransactionAsync(async () => {

                        await insertInstallmentOccurrence(database, installmentTransaction, installment.id, installment.card_id!)
                        await updateInstallmentLastProcessed(database, installment.id, nowDB)

                    })
                }
            }
            console.log("[CC Installments Module] Installments syncing complete")
        } catch (err) {
            console.error("[CC Installments Module] Could not sync pending installments", err)
            throw err
        }
    },[])

    return { createInstallmentPurchase, createAndSyncInstallments }

}
