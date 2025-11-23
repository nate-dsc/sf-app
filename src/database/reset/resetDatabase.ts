import { initializeDatabase } from "@/database/initializeDatabase"
import { SQLiteDatabase } from "expo-sqlite"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetDatabase(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        dropAll(database)
    })

    await initializeDatabase(database)

    console.log("Banco de dados resetado")
}

export async function dropAll(database: SQLiteDatabase) {

    await database.execAsync("DROP TABLE IF EXISTS transactions")
    await database.execAsync("DROP TABLE IF EXISTS transactions_recurring")
    await database.execAsync("DROP TABLE IF EXISTS cards")
    await database.execAsync("DROP TABLE IF EXISTS categories")
}