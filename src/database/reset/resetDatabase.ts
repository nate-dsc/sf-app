import { SQLiteDatabase } from "expo-sqlite"
import { initializeDatabase } from "../initializeDatabase"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetDatabase(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        dropAll(database)
    })

    console.log("Banco de dados resetado")

    await initializeDatabase(database)
}

export async function dropAll(database: SQLiteDatabase) {

    await database.execAsync(`
        DROP TABLE IF EXISTS transactions;
        DROP TABLE IF EXISTS transactions_recurring;
        DROP TABLE IF EXISTS cards;
        DROP TABLE IF EXISTS categories;
    `);
}