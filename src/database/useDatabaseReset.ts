import { useSQLiteContext } from "expo-sqlite"
import { useMemo } from "react"

import { resetBudgets } from "./resetBudgets"
import { resetCreditCards } from "./resetCreditCards"
import { resetRecurringTransactions } from "./resetRecurringTransactions"
import { resetRecurringTransactionsCascade } from "./resetRecurringTransactionsCascade"
import { resetTransactions } from "./resetTransactions"
import { resetCCDatabase } from "./ResetCCDatabase"
import { resetDatabase } from "./ResetDatabase"

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
    resetTransactions,
    resetRecurringTransactions,
    resetRecurringTransactionsCascade,
    resetCreditCards,
    resetBudgets,
    resetDatabase,
    resetCCDatabase,
}
