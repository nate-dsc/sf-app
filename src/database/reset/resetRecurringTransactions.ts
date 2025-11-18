import type { SQLiteDatabase } from "expo-sqlite"

import { initializeDatabase } from "@/database/useDatabase"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetRecurringTransactions(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        await database.execAsync(`DELETE FROM ${quoteIdentifier("transactions_recurring")}`)
    })

    await initializeDatabase(database)

    console.log("Transações recorrentes resetadas")
}
