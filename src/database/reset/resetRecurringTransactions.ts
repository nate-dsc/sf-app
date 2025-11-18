import type { SQLiteDatabase } from "expo-sqlite"

import { initializeAppDatabase } from "../useDatabase"

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export async function resetRecurringTransactions(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        await database.execAsync(`DELETE FROM ${quoteIdentifier("transactions_recurring")}`)
    })

    await initializeAppDatabase(database)

    console.log("Transações recorrentes resetadas")
}
