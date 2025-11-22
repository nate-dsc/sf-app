import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"

import {
    deleteTransaction,
    deleteTransaction as deleteTransactionRepository,
    fetchPaginatedFilteredTransactions,
    fetchTransactionsFromMonth,
    getTransactionByID,
    insertTransaction,
} from "@/database/repositories/TransactionRepository"
import { SearchFilters, type Transaction } from "@/types/Transactions"
import { freeCardLimitUsed } from "../repositories/CreditCardRepository"

export function useTransactionsModule(database: SQLiteDatabase) {
    const createTransaction = useCallback(async function createTransaction(data: Transaction) {
        try {
            await insertTransaction(database, data)

            const type = data.type ?? (data.value >= 0 ? "in" : "out")
            console.log(`[Transactions Module] Single transaction inserted:\nValue: ${data.value}\nDescription: ${data.description}\nCategory: ${data.category}\nDate: ${data.date}\nType: ${type}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const removeTransaction = useCallback(async (id: number) => {
        try {
            const transaction = await getTransactionByID(database, id)

            if(!transaction) {
                console.log("[Transactions Module] Could not find transaction to delete")
                return
            }

            if(transaction.card_id) {
                await database.withTransactionAsync(async () => {
                    await deleteTransaction(database, id)
                    await freeCardLimitUsed(database, transaction.card_id!, Math.abs(transaction.value))
                })
            } else {
                await deleteTransactionRepository(database, id)
            }
        } catch (error) {
            console.error("[Transactions Module] Could not delete transaction", error)
            throw error
        }
    }, [database])

    const getTransactionsFromMonth = useCallback(async function getTransactionsFromMonth(YMString: string, orderBy: "day" | "id") {
        try {
            const response = await fetchTransactionsFromMonth(database, YMString, orderBy)
            return response
        } catch (error) {
            console.log("[Transactions Module] Could not find transactions by month")
            throw error
        }
    }, [database])

    const getPaginatedFilteredTransactions = useCallback(async function getPaginatedFilteredTransactions(page: number, pageSize: number, filterOptions: SearchFilters = {}) {
        try {
            const response = await fetchPaginatedFilteredTransactions(database, page, pageSize, filterOptions)
            return response
        } catch (error) {
            console.error("[Transactions Module] Could not fetch paginated transactions", error)
            throw error
        }
    }, [database])

    return useMemo(() => ({
        createTransaction,
        removeTransaction,
        getTransactionsFromMonth,
        getPaginatedFilteredTransactions,
    }), [createTransaction, deleteTransaction, getTransactionsFromMonth, getPaginatedFilteredTransactions])
}
