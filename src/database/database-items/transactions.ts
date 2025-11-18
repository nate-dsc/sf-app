import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"

import { SearchFilters, type Transaction } from "@/types/transaction"

export function useTransactionsModule(database: SQLiteDatabase) {

    const createTransaction = useCallback(async (data: Transaction) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions (value, description, category, date, type) VALUES ($value, $description, $category, $date, $type)"
        )

        const type = data.type ?? (data.value >= 0 ? "in" : "out")

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date: data.date,
                $type: type,
            })

            console.log(`Transação única inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData: ${data.date}\nTipo: ${type}`)
        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const deleteTransaction = useCallback(async (id: number) => {
        try {
            await database.runAsync("DELETE FROM transactions WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete transaction", error)
            throw error
        }
    }, [database])

    const getTransactionsFromMonth = useCallback(async (YMString: string, orderBy: "day" | "id") => {
        const orderStr = orderBy === "id" ? "id" : "CAST(strftime('%d', date) AS INTEGER)"

        try {
            const query = `SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ${YMString} ORDER BY ${orderStr}`
            const response = await database.getAllAsync<Transaction>(query)
            return response
        } catch (error) {
            console.log("Could not find transactions by month")
            throw error
        }
    }, [database])

    const getPaginatedFilteredTransactions = useCallback(async (page: number, pageSize: number, filterOptions: SearchFilters = {}) => {
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

        if (filterOptions.type === "inflow") {
            whereClauses.push("flow = 'inflow'")
        } else if (filterOptions.type === "outflow") {
            whereClauses.push("flow = 'outflow'")
        }

        if (filterOptions.minValue !== undefined) {
            if (filterOptions.type === "inflow") {
                whereClauses.push("value >= ?")
                params.push(filterOptions.minValue)
            } else if (filterOptions.type === "outflow") {
                whereClauses.push("value <= ?")
                params.push(-filterOptions.minValue)
            } else {
                whereClauses.push("(value >= ? OR value <= ?)")
                params.push(filterOptions.minValue, -filterOptions.minValue)
            }
        }

        if (filterOptions.maxValue !== undefined) {
            if (filterOptions.type === "inflow") {
                whereClauses.push("value <= ?")
                params.push(filterOptions.maxValue)
            } else if (filterOptions.type === "outflow") {
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
            whereClauses.push(
                "id_recurring IN (SELECT id FROM transactions_recurring WHERE is_installment = 1)"
            )
        } else if (filterOptions.cardChargeType === "recurring") {
            whereClauses.push(
                "id_recurring IN (SELECT id FROM transactions_recurring WHERE is_installment = 0)"
            )
        } else if (filterOptions.cardChargeType === "single") {
            whereClauses.push("id_recurring IS NULL")
        }

        if (filterOptions.dateFilterActive && filterOptions.initialDate && filterOptions.finalDate) {
            whereClauses.push("date BETWEEN ? AND ?")
            params.push(
                filterOptions.initialDate.toISOString().slice(0, 16),
                filterOptions.finalDate.toISOString().slice(0, 16)
            )
        }

        let query = "SELECT * FROM transactions"
        if (whereClauses.length > 0) {
            query += " WHERE " + whereClauses.join(" AND ")
        }

        const sortBy = filterOptions.sortBy === "value" ? "value" : "date"
        const orderBy = filterOptions.orderBy === "asc" ? "ASC" : "DESC"

        query += ` ORDER BY ${sortBy} ${orderBy}, id DESC LIMIT ? OFFSET ?`
        params.push(pageSize, offset)

        try {
            const response = await database.getAllAsync<Transaction>(query, params)
            return response
        } catch (error) {
            console.error("Could not fetch paginated transactions", error)
            throw error
        }
    }, [database])

    return useMemo(() => ({
        createTransaction,
        deleteTransaction,
        getTransactionsFromMonth,
        getPaginatedFilteredTransactions,
    }), [createTransaction, deleteTransaction, getTransactionsFromMonth, getPaginatedFilteredTransactions])
}
