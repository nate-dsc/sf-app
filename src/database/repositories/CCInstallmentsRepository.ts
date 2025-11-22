import { RecurringTransaction } from "@/types/Transactions"
import { SQLiteDatabase } from "expo-sqlite"

type InstallmentRecurringRow = RecurringTransaction & {
    due_day: number | null
    ignore_weekends: number | null
}

export async function insertInstallmentPurchase(
    database: SQLiteDatabase,
    data: RecurringTransaction,
    cardId: number,
    limitAdjustment: number,
) {
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

export async function insertInstallmentOccurrence(
    database: SQLiteDatabase,
    payload: RecurringTransaction & { date: string },
    cardId: number,
) {
    await database.runAsync(
        "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            payload.value,
            payload.description,
            Number(payload.category),
            payload.date,
            payload.id,
            cardId,
            payload.type ?? (payload.value >= 0 ? "in" : "out"),
        ],
    )
}

export async function updateInstallmentLastProcessed(database: SQLiteDatabase, recurringId: number, processedDate: string) {
    await database.runAsync("UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?", [processedDate, recurringId])
}
