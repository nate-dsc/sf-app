import { Transaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

import { useCreditCardModule } from "@/database/modules/CreditCardModule";
import { insertCardTransaction } from "@/database/repositories/CCTransactionsRepository";

export function useCCTransactionsModule(database: SQLiteDatabase) {
    const { getCard } = useCreditCardModule(database)

    const createTransactionWithCard = useCallback(async (data: Transaction) => {
        if(data.card_id) {
            try {
                const card = await getCard(data.card_id)
                if(!card) return
                const availableLimit = card.maxLimit - card.limitUsed
                if (availableLimit >= data.value) {
                    await insertCardTransaction(database, data, data.card_id)
                }
            } catch (err) {
                console.error(`[CC Transactions Module] Could not insert credit card transaction`, err)
            }
        }
    },[])

    return { createTransactionWithCard }
}