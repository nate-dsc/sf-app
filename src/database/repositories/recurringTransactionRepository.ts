import type { CardSnapshot } from "@/types/database"
import type { SQLiteDatabase } from "expo-sqlite"

import type { RecurringTransaction } from "@/types/Transactions"

type InstallmentBlueprintRow = RecurringTransaction & {
    due_day: number | null
    closing_day: number | null
    ignore_weekends: number | null
    category_name: string | null
}

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

export async function fetchActiveRecurringTransactions(database: SQLiteDatabase) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE is_installment = 0 OR is_installment IS NULL",
    )
}

export async function fetchRecurringRule(database: SQLiteDatabase, id: number) {
    const parentTransaction = await database.getFirstAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE id = ?",
        [id],
    )

    return parentTransaction?.rrule ?? null
}

export async function fetchCardSnapshot(database: SQLiteDatabase, cardId: number) {
    const snapshot = await database.getFirstAsync<CardSnapshot>(
        "SELECT max_limit, limit_used, name FROM cards WHERE id = ?",
        [cardId],
    )

    return snapshot ?? null
}

export async function fetchRecurringTransactionsForCard(database: SQLiteDatabase, cardId: number) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT id, value, rrule, date_start, is_installment FROM transactions_recurring WHERE card_id = ?",
        [cardId],
    )
}

export async function fetchInstallmentRecurringTransactions(database: SQLiteDatabase) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE is_installment = 1",
    )
}

export async function insertInstallmentRecurringTransaction(
    database: SQLiteDatabase,
    payload: { value: number; description: string; categoryId: number; dateStart: string; rrule: string; cardId: number },
) {
    await database.runAsync(
        "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            payload.value,
            payload.description,
            payload.categoryId,
            payload.dateStart,
            payload.rrule,
            null,
            payload.cardId,
            1,
            payload.value >= 0 ? "in" : "out",
        ],
    )
}

export async function fetchInstallmentBlueprintsWithCardDetails(database: SQLiteDatabase, cardId: number) {
    return database.getAllAsync<InstallmentBlueprintRow>(
        `SELECT tr.id, tr.value, tr.description, tr.category, tr.date_start, tr.rrule, tr.date_last_processed, tr.card_id, tr.type, tr.is_installment, c.due_day, c.closing_day, c.ignore_weekends, cat.name as category_name
             FROM transactions_recurring tr
             JOIN cards c ON c.id = tr.card_id
             LEFT JOIN categories cat ON cat.id = tr.category
             WHERE tr.card_id = ? AND tr.is_installment = 1`,
        [cardId],
    )
}

export async function fetchLastInsertedRecurringId(database: SQLiteDatabase) {
    const insertedRow = await database.getFirstAsync<{ id: number }>("SELECT last_insert_rowid() as id")

    return insertedRow?.id ?? 0
}

export async function insertRecurringOccurrence(
    database: SQLiteDatabase,
    payload: {
        value: number
        description: string
        category: number
        date: string
        recurringId: number
        cardId?: number | null
        type: "in" | "out"
    },
) {
    await database.runAsync(
        "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            payload.value,
            payload.description,
            payload.category,
            payload.date,
            payload.recurringId,
            payload.cardId ?? null,
            payload.type,
        ],
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
