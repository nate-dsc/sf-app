import { Transaction } from "@/types/transaction";
import { SQLiteDatabase } from "expo-sqlite";

export async function insertCardTransaction(database: SQLiteDatabase, data: Transaction) {

    const limitAdjustment = Math.abs(data.value)

    await database.withTransactionAsync(async () => {

        await database.runAsync("INSERT INTO transactions (value, description, category, date, type) VALUES (?,?,?,?,?)",
            [data.value, data.description, Number(data.category), data.date, data.type]
        )
        if(data.card_id) await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, data.card_id])
    })
}