import { RecurringTransaction, Transaction } from "@/types/Transactions";
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

export async function fetchRecurringTransactionsWithCard(database: SQLiteDatabase) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE is_installment = 0 AND card_id IS NOT NULL"
    )
}

export async function insertCardTransactionRecurringOcurrence(database: SQLiteDatabase, data: Transaction, idRecurring: number, cardId: number) {
    await database.runAsync(
        "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [data.value, data.description, data.category, data.date, idRecurring, cardId, data.type],
    )
}

export async function setRecurringTransactionsWithCardLastProcessed(database: SQLiteDatabase, idRecurring: number, processedDate: string) {
    await database.runAsync("UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?", [processedDate, idRecurring])
}

export async function deleteRecurringTransactionWithCard(database: SQLiteDatabase, idRecurring: number) {
    await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [idRecurring])
}

export async function deleteRecurringTransactionWithCardCascade(database: SQLiteDatabase, idRecurring: number) {
    await database.withTransactionAsync(async () => {
        
        await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [idRecurring])
        await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [idRecurring])

    })
}