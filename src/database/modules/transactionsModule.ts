import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"

import {
    deleteTransaction as deleteTransactionRepository,
    fetchPaginatedFilteredTransactions,
    fetchTransactionsFromMonth,
    insertTransaction,
} from "@/database/repositories/transactionRepository"
import { SearchFilters, type Transaction } from "@/types/transaction"

export function useTransactionsModule(database: SQLiteDatabase) {

    const createTransaction = useCallback(async function createTransaction(data: Transaction) {
        try {
            await insertTransaction(database, data)

            const type = data.type ?? (data.value >= 0 ? "in" : "out")
            console.log(`Single transaction inserted:\nValue: ${data.value}\nDescription: ${data.description}\nCategory: ${data.category}\nDate: ${data.date}\nType: ${type}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const deleteTransaction = useCallback(async function deleteTransaction(id: number) {
        try {
            await deleteTransactionRepository(database, id)
        } catch (error) {
            console.error("Could not delete transaction", error)
            throw error
        }
    }, [database])

    const getTransactionsFromMonth = useCallback(async function getTransactionsFromMonth(YMString: string, orderBy: "day" | "id") {
        try {
            const response = await fetchTransactionsFromMonth(database, YMString, orderBy)
            return response
        } catch (error) {
            console.log("Could not find transactions by month")
            throw error
        }
    }, [database])

    const getPaginatedFilteredTransactions = useCallback(async function getPaginatedFilteredTransactions(page: number, pageSize: number, filterOptions: SearchFilters = {}) {
        try {
            const response = await fetchPaginatedFilteredTransactions(database, page, pageSize, filterOptions)
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
