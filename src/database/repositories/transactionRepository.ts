import type { SQLiteDatabase } from "expo-sqlite"

import type { SearchFilters, Transaction, TransactionType } from "@/types/transaction"

export async function insertTransaction(database: SQLiteDatabase, data: Transaction) {
    const statement = await database.prepareAsync(
        "INSERT INTO transactions (value, description, category, date, type) VALUES ($value, $description, $category, $date, $type)"
    )

    try {
        await statement.executeAsync({
            $value: data.value,
            $description: data.description,
            $category: Number(data.category),
            $date: data.date,
            $type: data.type,
        })
    } finally {
        await statement.finalizeAsync()
    }
}

export async function deleteTransaction(database: SQLiteDatabase, id: number) {
    await database.runAsync("DELETE FROM transactions WHERE id = ?", [id])
}

export async function fetchTransactionsFromMonth(database: SQLiteDatabase, YMString: string, orderBy: "day" | "id") {
    const orderStr = orderBy === "id" ? "id" : "CAST(strftime('%d', date) AS INTEGER)"
    const query = `SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY ${orderStr}`

    return database.getAllAsync<Transaction>(query, [YMString])
}

export async function fetchPaginatedFilteredTransactions(database: SQLiteDatabase, page: number, pageSize: number, filterOptions: SearchFilters = {}) {
    const offset = page * pageSize

    const whereClauses: string[] = []
    const params: (string | number)[] = []

    if (filterOptions.textSearch && filterOptions.textSearch.trim() !== "") {
        whereClauses.push("description LIKE ?")
        params.push(`%${filterOptions.textSearch.trim()}%`)
    }

    if (filterOptions.category && filterOptions.category.length > 0) {
        const placeholders = filterOptions.category.map(() => "?").join(", ")
        whereClauses.push(`category IN (${placeholders})`)
        params.push(...filterOptions.category)
    }

    if (filterOptions.type === "in") {
        whereClauses.push("type = 'in'")
    } else if (filterOptions.type === "out") {
        whereClauses.push("type = 'out'")
    }

    if (filterOptions.minValue !== undefined) {
        if (filterOptions.type === "in") {
            whereClauses.push("value >= ?")
            params.push(filterOptions.minValue)
        } else if (filterOptions.type === "out") {
            whereClauses.push("value <= ?")
            params.push(-filterOptions.minValue)
        } else {
            whereClauses.push("(value >= ? OR value <= ?)")
            params.push(filterOptions.minValue, -filterOptions.minValue)
        }
    }

    if (filterOptions.maxValue !== undefined) {
        if (filterOptions.type === "in") {
            whereClauses.push("value <= ?")
            params.push(filterOptions.maxValue)
        } else if (filterOptions.type === "out") {
            whereClauses.push("value >= ?")
            params.push(-filterOptions.maxValue)
        } else {
            whereClauses.push("(value <= ? OR value >= ?)")
            params.push(filterOptions.maxValue, -filterOptions.maxValue)
        }
    }

    if (filterOptions.cardId !== undefined) {
        whereClauses.push("card_id = ?")
        params.push(filterOptions.cardId)
    }

    if (filterOptions.cardChargeType === "installments") {
        whereClauses.push("id_recurring IN (SELECT id FROM transactions_recurring WHERE is_installment = 1)")
    } else if (filterOptions.cardChargeType === "recurring") {
        whereClauses.push("id_recurring IN (SELECT id FROM transactions_recurring WHERE is_installment = 0)")
    } else if (filterOptions.cardChargeType === "single") {
        whereClauses.push("id_recurring IS NULL")
    }

    if (filterOptions.dateFilterActive && filterOptions.initialDate && filterOptions.finalDate) {
        whereClauses.push("date BETWEEN ? AND ?")
        params.push(filterOptions.initialDate.toISOString().slice(0, 16), filterOptions.finalDate.toISOString().slice(0, 16))
    }

    let query = "SELECT * FROM transactions"
    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ")
    }

    const sortBy = filterOptions.sortBy === "value" ? "value" : "date"
    const orderBy = filterOptions.orderBy === "asc" ? "ASC" : "DESC"

    query += ` ORDER BY ${sortBy} ${orderBy}, id DESC LIMIT ? OFFSET ?`
    params.push(pageSize, offset)

    return database.getAllAsync<Transaction>(query, params)
}

export async function fetchTotalBetween(database: SQLiteDatabase, type: TransactionType, startDateISO: string, endDateISO: string) {
    const startISO = startDateISO.slice(0, 10)
    const endISO = endDateISO.slice(0, 10)

    const result = await database.getFirstAsync<{ total: number | null }>(
        "SELECT SUM(value) as total FROM transactions WHERE type = ? AND date(date) BETWEEN ? AND ?",
        [type, startISO, endISO]
    )

    return result
}

export async function fetchLastTransaction(database: SQLiteDatabase) {
    return database.getFirstAsync<Transaction>("SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 1")
}
