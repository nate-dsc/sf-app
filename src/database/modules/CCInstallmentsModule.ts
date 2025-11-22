import { useCreditCardModule } from "@/database/modules/CreditCardModule"
import {
    fetchActiveInstallments,
    insertInstallmentOccurrence,
    insertInstallmentPurchase,
    updateInstallmentLastProcessed
} from "@/database/repositories/CCInstallmentsRepository"
import { InstallmentPurchase } from "@/types/CreditCards"
import { Transaction } from "@/types/Transactions"
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

                for(const occurrence of pendingOccurrences) {
                    //console.log(occurrence)

                    const local = new Date(
                        occurrence.getTime() - occurrence.getTimezoneOffset() * 60000
                    )

                    local.setHours(0,0,0)
                    const localStartOfDayISO = local.toISOString().slice(0,16)

                    local.setHours(23,59,59)
                    const localEndOfDayISO = local.toISOString().slice(0,16)

                    //console.log(localStartOfDayISO)
                    //console.log(localEndOfDayISO)

                    const installmentTransaction: Transaction = {
                        id: 0,
                        value: installment.value,
                        description: installment.description,
                        category: installment.category,
                        date: localStartOfDayISO,
                        id_recurring: installment.id,
                        card_id: installment.card_id,
                        type: "out"
                    }

                    await insertInstallmentOccurrence(database, installmentTransaction, installment.id, installment.card_id!)

                    await updateInstallmentLastProcessed(database, installment.id, localEndOfDayISO)


                }
            }
            console.log("[CC Installments Module] Installments syncing complete")
        } catch (err) {
            console.error("[CC Installments Module] Could not sync pending installments")
            throw err
        }
    },[])

    return { createInstallmentPurchase, createAndSyncInstallments }

}
