import { useSQLiteContext } from "expo-sqlite"
import { useMemo } from "react"

import { resetBudgets } from "./reset/resetBudgets"
import { resetCreditCards } from "./reset/resetCreditCards"
import { resetDatabase } from "./reset/resetDatabase"
import { resetRecurringTransactions } from "./reset/resetRecurringTransactions"
import { resetRecurringTransactionsCascade } from "./reset/resetRecurringTransactionsCascade"
import { resetCCDatabase } from "./ResetCCDatabase"
import { resetTransactions } from "./resetTransactions"

export function useDatabaseReset() {
    const database = useSQLiteContext()

    return useMemo(
        () => ({
            resetTransactions: () => resetTransactions(database),
            resetRecurringTransactions: () => resetRecurringTransactions(database),
            resetRecurringTransactionsCascade: () => resetRecurringTransactionsCascade(database),
            resetCreditCards: () => resetCreditCards(database),
            resetBudgets: () => resetBudgets(database),
            resetDatabase: () => resetDatabase(database),
            resetCCDatabase: () => resetCCDatabase(database),
        }),
        [database]
    )
}

export {
    resetBudgets, resetCCDatabase, resetCreditCards, resetDatabase, resetRecurringTransactions,
    resetRecurringTransactionsCascade, resetTransactions
}

