import type { CardSnapshot, SQLiteExecutor } from "@/types/database"

import type { RecurringTransaction } from "@/types/transaction"

export async function insertRecurringTransaction(
    database: SQLiteExecutor,
    data: RecurringTransaction,
    cardId?: number,
) {
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

export async function removeRecurringTransaction(database: SQLiteExecutor, id: number) {
    await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
}

export async function removeRecurringTransactionCascade(database: SQLiteExecutor, id: number) {
    await database.withTransactionAsync?.(async () => {
        await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [id])
        await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
    })
}

export async function fetchActiveRecurringTransactions(database: SQLiteExecutor) {
    return database.getAllAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE is_installment = 0 OR is_installment IS NULL",
    )
}

export async function fetchRecurringRule(database: SQLiteExecutor, id: number) {
    const parentTransaction = await database.getFirstAsync<RecurringTransaction>(
        "SELECT * FROM transactions_recurring WHERE id = ?",
        [id],
    )

    return parentTransaction?.rrule ?? null
}

export async function fetchCardSnapshot(database: SQLiteExecutor, cardId: number) {
    const snapshot = await database.getFirstAsync<CardSnapshot>(
        "SELECT max_limit, limit_used, name FROM cards WHERE id = ?",
        [cardId],
    )

    return snapshot ?? null
}

export async function insertRecurringOccurrence(
    database: SQLiteExecutor,
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

export async function updateCardLimitUsed(database: SQLiteExecutor, cardId: number, limitAdjustment: number) {
    await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, cardId])
}

export async function updateRecurringLastProcessed(database: SQLiteExecutor, recurringId: number, processedDate: string) {
    await database.runAsync(
        "UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
        [processedDate, recurringId],
    )
}

export async function fetchRecurringTransactionsByType(database: SQLiteExecutor, type: "in" | "out") {
    const query = type === "out"
        ? "SELECT * FROM transactions_recurring WHERE type = 'out'"
        : "SELECT * FROM transactions_recurring WHERE type = 'in'"

    return database.getAllAsync<RecurringTransaction>(query)
}
