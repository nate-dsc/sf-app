import { CCardDB, NewCard, UpdateCardInput } from "@/types/CreditCards"
import type { SQLiteDatabase } from "expo-sqlite"

export type CardInstallmentSnapshot = {
    max_limit: number | null
    limit_used: number | null
    closing_day: number | null
    due_day: number | null
    ignore_weekends: number | null
}

export async function insertCard(database: SQLiteDatabase, data: NewCard) {
    await database.runAsync(
        "INSERT INTO cards (name, color, max_limit, limit_used, closing_day, due_day, ignore_weekends) VALUES(?,?,?,?,?,?,?)",
        [
            data.name,
            data.color,
            data.maxLimit,
            0,
            data.closingDay,
            data.dueDay,
            data.ignoreWeekends ? 1 : 0,
        ],
    )
}

export async function updateCardDB(database: SQLiteDatabase, cardId: number, input: UpdateCardInput) {
    const fields: string[] = []
    const values: any[] = []

    if (input.name !== undefined) {
        fields.push("name = ?")
        values.push(input.name)
    }

    if (input.color !== undefined) {
        fields.push("color = ?")
        values.push(input.color)
    }

    if (input.maxLimit !== undefined) {
        fields.push('max_limit = ?')
        values.push(input.maxLimit)
    }

    if (input.limitUsed !== undefined) {
        fields.push("limit_used = ?")
        values.push(input.limitUsed)
    }

    if (input.closingDay !== undefined) {
        fields.push("closing_day = ?")
        values.push(input.closingDay)
    }

    if (input.dueDay !== undefined) {
        fields.push("due_day = ?")
        values.push(input.dueDay)
    }

    if (input.ignoreWeekends !== undefined) {
        fields.push("ignore_weekends = ?")
        values.push(input.ignoreWeekends ? 1 : 0)
    }

    if (fields.length === 0) {
        return
    }

    fields.push("updated_at = datetime('now')")

    values.push(cardId)

    await database.runAsync(`UPDATE cards SET ${fields.join(", ")} WHERE id = ?`, values)
}

export async function deleteCardDB(database: SQLiteDatabase, cardId: number) {
    await database.runAsync("DELETE FROM cards WHERE id = ?", [cardId])
}

export async function fetchCard(database: SQLiteDatabase, cardId: number): Promise<CCardDB | null> {
    const row = await database.getFirstAsync<CCardDB>(
        "SELECT id, name, color, max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards WHERE id = ?",
        [cardId],
    )

    return row ?? null
}

export async function fetchCards(database: SQLiteDatabase): Promise<CCardDB[]> {
    return database.getAllAsync<CCardDB>(
        "SELECT id, name, color, max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards",
    )
}

export async function updateCardLimitUsed(database: SQLiteDatabase, cardId: number, limitAdjustment: number) {
    await database.runAsync("UPDATE cards SET limit_used = limit_used + ? WHERE id = ?", [limitAdjustment, cardId])
}

export async function freeCardLimitUsed(database: SQLiteDatabase, cardId: number, limitAdjustment: number) {
    await database.runAsync("UPDATE cards SET limit_used = limit_used - ? WHERE id = ?", [limitAdjustment, cardId])
}

export async function fetchCardInstallmentSnapshot(database: SQLiteDatabase, cardId: number) {
    return database.getFirstAsync<CardInstallmentSnapshot>(
        "SELECT max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards WHERE id = ?",
        [cardId],
    )
}

export async function fetchCardDueDay(database: SQLiteDatabase, cardId: number) {
    return database.getFirstAsync<{ due_day: number }>("SELECT due_day FROM cards WHERE id = ?", [cardId])
}

export async function fetchByAvailableLimit(database: SQLiteDatabase, necessaryAmount: number): Promise<CCardDB[] | null> {
    return database.getAllAsync<CCardDB>(
        "SELECT * FROM cards WHERE (max_limit - limit_used) > ?",
        [necessaryAmount]
    )
}