import { SQLiteDatabase } from "expo-sqlite"
import { initializeAppDatabase } from "./useDatabase"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetDatabase(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        const tables = await database.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )

        for (const table of tables) {
            await database.execAsync(`DROP TABLE IF EXISTS ${quoteIdentifier(table.name)}`)
        }
    })

    await initializeAppDatabase(database)

    console.log("Banco de dados resetado")
}
