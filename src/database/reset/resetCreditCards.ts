import type { SQLiteDatabase } from "expo-sqlite"

import { initializeDatabase } from "@/database/useDatabase"

const CARD_TABLES = [
    "card_statement_transactions",
    "card_statements",
    "cards",
]

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetCreditCards(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        for (const table of CARD_TABLES) {
            await database.execAsync(`DROP TABLE IF EXISTS ${quoteIdentifier(table)}`)
        }
    })

    await initializeDatabase(database)

    console.log("Banco de dados de cartões de crédito resetado")
}
