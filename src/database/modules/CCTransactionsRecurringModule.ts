import { RecurringTransaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

import { useStyle } from "@/context/StyleContext";
import { useCreditCardModule } from "@/database/modules/CreditCardModule";
import { insertCardTransactionRecurring } from "@/database/repositories/CCTransactionsRecurringRepository";

export function useCCTransactionsRecurringModule(database: SQLiteDatabase) {
    const { theme } = useStyle()
    const { getCard } = useCreditCardModule(database, theme)

    const createTransactionRecurringWithCard = useCallback(async (data: RecurringTransaction) => {
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

    return {createTransactionRecurringWithCard}
}