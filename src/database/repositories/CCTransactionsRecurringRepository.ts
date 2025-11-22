import { RecurringTransaction } from "@/types/Transactions";
import { SQLiteDatabase } from "expo-sqlite";

export async function insertCardTransactionRecurring(database: SQLiteDatabase, data: RecurringTransaction, cardId: number) {

    const limitAdjustment = Math.abs(data.value)
    
    await database.withTransactionAsync(async () => {
        await database.runAsync("INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, type, is_installment) VALUES (?,?,?,?,?,?,?,?,?)",
            [data.value, data.description, Number(data.category), data.date_start,data.rrule, data.date_last_processed, cardId, data.type, 0]
        )
        await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, cardId])
    })
}