import { Transaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";

export async function insertCardTransaction(database: SQLiteDatabase, data: Transaction, cardId: number) {

    const limitAdjustment = Math.abs(data.value)
    
    await database.withTransactionAsync(async () => {
        await database.runAsync("INSERT INTO transactions (value, description, category, date, card_id, type) VALUES (?,?,?,?,?,?)",
            [data.value, data.description, Number(data.category), data.date, cardId, data.type]
        )
        await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, cardId])
    })
}