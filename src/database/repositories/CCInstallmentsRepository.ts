import { RecurringTransaction, Transaction } from "@/types/Transactions"
import { SQLiteDatabase } from "expo-sqlite"

export async function insertInstallmentPurchase(database: SQLiteDatabase, data: RecurringTransaction, cardId: number, limitAdjustment: number) {
    await database.withTransactionAsync(async () => {
        await database.runAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, type, is_installment) VALUES (?,?,?,?,?,?,?,?,?)",
            [data.value, data.description, Number(data.category), data.date_start, data.rrule, data.date_last_processed, cardId, data.type, 1],
        )
        await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, cardId])
    })
}

export async function fetchActiveInstallments(database: SQLiteDatabase) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE is_installment = 1",
    )
}

export async function insertInstallmentOccurrence(database: SQLiteDatabase, data: Transaction, idRecurring: number, cardId: number) {
    await database.runAsync(
        "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [data.value, data.description, data.category, data.date, idRecurring, cardId, data.type],
    )
}

export async function updateInstallmentLastProcessed(database: SQLiteDatabase, installmentId: number, processedDate: string) {
    await database.runAsync("UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?", [processedDate, installmentId])
}
