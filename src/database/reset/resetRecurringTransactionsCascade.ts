import type { SQLiteDatabase } from "expo-sqlite"

import { initializeDatabase } from "@/database/useDatabase"

const DEPENDENT_TABLES = [
    "card_statement_transactions",
    "transaction_tags",
]

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

const RECURRING_TRANSACTIONS_SUBQUERY =
    "SELECT id FROM transactions WHERE id_recurring IS NOT NULL"

export async function resetRecurringTransactionsCascade(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        for (const table of DEPENDENT_TABLES) {
            await database.execAsync(
                `DELETE FROM ${quoteIdentifier(table)} WHERE transaction_id IN (${RECURRING_TRANSACTIONS_SUBQUERY})`
            )
        }

        await database.execAsync(
            `DELETE FROM ${quoteIdentifier("transactions")} WHERE id_recurring IS NOT NULL`
        )
        await database.execAsync(`DELETE FROM ${quoteIdentifier("transactions_recurring")}`)
    })

    await initializeDatabase(database)

    console.log("Transações recorrentes e geradas resetadas")
}
