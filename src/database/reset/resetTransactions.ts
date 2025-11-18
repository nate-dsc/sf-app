import type { SQLiteDatabase } from "expo-sqlite"

import { initializeDatabase } from "@/database/useDatabase"

const TRANSACTION_TABLES = [
    "card_statement_transactions",
    "transaction_tags",
    "transactions",
]

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetTransactions(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        for (const table of TRANSACTION_TABLES) {
            await database.execAsync(`DELETE FROM ${quoteIdentifier(table)}`)
        }
    })

    await initializeDatabase(database)

    console.log("Transações resetadas")
}
