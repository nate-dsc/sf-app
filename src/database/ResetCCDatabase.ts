import { SQLiteDatabase } from "expo-sqlite"
import { initializeAppDatabase } from "./useDatabase"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetCCDatabase(database: SQLiteDatabase) {
    const cardRelatedTables = [
        "card_statement_transactions",
        "card_statements",
        "cards",
    ]

    await database.withTransactionAsync(async () => {
        for (const table of cardRelatedTables) {
            await database.execAsync(`DROP TABLE IF EXISTS ${quoteIdentifier(table)}`)
        }
    })

    await initializeAppDatabase(database)

    console.log("Banco de dados de cartões de crédito resetado")
}
