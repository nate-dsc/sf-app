import type { SQLiteDatabase } from "expo-sqlite"

import type { RecurringTransaction, Transaction } from "@/types/Transactions"

export async function insertRecurringTransaction(database: SQLiteDatabase, data: RecurringTransaction, cardId?: number) {
    const statement = await database.prepareAsync(
        "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, type, is_installment) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed, $card_id, $type, $is_installment)"
    )

    const type = data.type ?? (data.value >= 0 ? "in" : "out")

    try {
        await statement.executeAsync({
            $value: data.value,
            $description: data.description,
            $category: Number(data.category),
            $date_start: data.date_start,
            $rrule: data.rrule,
            $date_last_processed: null,
            $card_id: cardId ?? data.card_id ?? null,
            $type: type,
            $is_installment: data.is_installment ?? 0,
        })
    } finally {
        await statement.finalizeAsync()
    }
}

export async function removeRecurringTransaction(database: SQLiteDatabase, id: number) {
    await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
}

export async function removeRecurringTransactionCascade(database: SQLiteDatabase, id: number) {
    await database.withTransactionAsync?.(async () => {
        await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [id])
        await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
    })
}

export async function fetchRecurringTransactions(database: SQLiteDatabase) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE (is_installment = 0 OR is_installment IS NULL) AND card_id IS NULL",
    )
}

export async function fetchRecurringRule(database: SQLiteDatabase, id: number) {
    const parentTransaction = await database.getFirstAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE id = ?",
        [id],
    )

    return parentTransaction?.rrule ?? null
}


export async function fetchLastInsertedRecurringId(database: SQLiteDatabase) {
    const insertedRow = await database.getFirstAsync<{ id: number }>("SELECT last_insert_rowid() as id")

    return insertedRow?.id ?? 0
}

export async function insertRecurringOcurrence(database: SQLiteDatabase, data: Transaction, idRecurring: number) {
    await database.runAsync(
        "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [data.value, data.description, data.category, data.date, idRecurring, null, data.type],
    )
}

export async function updateRecurringLastProcessed(database: SQLiteDatabase, recurringId: number, processedDate: string) {
    await database.runAsync(
        "UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
        [processedDate, recurringId],
    )
}

export async function fetchRecurringTransactionsByType(database: SQLiteDatabase, type: "in" | "out") {
    const query = type === "out"
        ? "SELECT * FROM transactions_recurring WHERE type = 'out'"
        : "SELECT * FROM transactions_recurring WHERE type = 'in'"

    return database.getAllAsync<RecurringTransaction>(query)
}
