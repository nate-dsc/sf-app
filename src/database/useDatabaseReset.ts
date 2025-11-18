import { useSQLiteContext } from "expo-sqlite"
import { useMemo } from "react"

import { resetBudgets } from "@/database/reset/resetBudgets"
import { resetCreditCards } from "@/database/reset/resetCreditCards"
import { resetDatabase } from "@/database/reset/resetDatabase"
import { resetRecurringTransactions } from "@/database/reset/resetRecurringTransactions"
import { resetRecurringTransactionsCascade } from "@/database/reset/resetRecurringTransactionsCascade"
import { resetTransactions } from "@/database/reset/resetTransactions"

export function useDatabaseReset() {
    const database = useSQLiteContext()

    return useMemo(
        () => ({
            resetTransactionsDB: () => resetTransactions(database),
            resetRecurringTransactionsDB: () => resetRecurringTransactions(database),
            resetRecurringTransactionsCascadeDB: () => resetRecurringTransactionsCascade(database),
            resetCreditCardsDB: () => resetCreditCards(database),
            resetBudgetsDB: () => resetBudgets(database),
            resetDatabaseDB: () => resetDatabase(database),
        }),
        [database]
    )
}

export {
    resetBudgets, resetCreditCards, resetDatabase, resetRecurringTransactions,
    resetRecurringTransactionsCascade, resetTransactions
}

