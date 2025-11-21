import { Transaction } from "@/types/transaction";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

import { useStyle } from "@/context/StyleContext";
import { useCreditCardModule } from "@/database/modules/creditCardModule";
import { insertCardTransaction } from "../repositories/CCTransactionsRepository";

export function useCCTransactionsModule(database: SQLiteDatabase) {
    const { theme } = useStyle()
    const { getCard } = useCreditCardModule(database, theme)

    const createTransactionWithCard = useCallback(async (data: Transaction) => {
        if(data.card_id) {
            try {
                const card = await getCard(data.card_id)
                if(!card) return
                const availableLimit = card.maxLimit - card.limitUsed
                if (availableLimit >= data.value) {
                    await insertCardTransaction(database, data)
                }
            } catch (err) {
                console.error(`[CC Transactions Module] Could not insert credit card transaction`, err)
            }
        }
    },[])
}