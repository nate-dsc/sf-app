import { useStyle } from "@/context/StyleContext"
import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { useMemo } from "react"

import { useBudgetsModule } from "./database-items/budgets"
import { useCreditCardTransactionsModule } from "./database-items/creditCardTransactions"
import { useRecurringTransactionsModule } from "./database-items/recurringTransactions"
import { useTransactionsModule } from "./database-items/transactions"
import { useDatabase } from "./useDatabase"

export function useTransactionDatabase() {
    const { theme } = useStyle()
    const { database } = useDatabase()
    const { notifyRecurringChargeSkipped } = useRecurringCreditLimitNotification()

    const transactions = useTransactionsModule(database)
    const recurring = useRecurringTransactionsModule(database, notifyRecurringChargeSkipped)
    const creditCard = useCreditCardTransactionsModule(database, theme)
    const budgets = useBudgetsModule(database)

    return useMemo(
        () => ({
            ...transactions,
            ...recurring,
            ...creditCard,
            ...budgets,
        }),
        [budgets, creditCard, recurring, transactions],
    )
}
