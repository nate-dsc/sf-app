import type { SQLiteDatabase } from "expo-sqlite"

import { initializeAppDatabase } from "./useDatabase"

const TRANSACTION_TABLES = [
    "card_statement_transactions",
    "transaction_tags",
    "attachments",
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

    await initializeAppDatabase(database)

    console.log("Transações resetadas")
}
