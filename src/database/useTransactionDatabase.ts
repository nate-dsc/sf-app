import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { useMemo } from "react"

import { useBudgetsModule } from "./modules/BudgetModule"
import { useCreditCardTransactionsModule } from "./modules/CCTransactionsModule"
import { useCreditCardModule } from "./modules/CreditCardModule"
import { useRecurringTransactionsModule } from "./modules/RecurringTransactionsModule"
import { useTransactionsModule } from "./modules/TransactionsModule"
import { useDatabase } from "./useDatabase"

export function useTransactionDatabase() {
    const { database } = useDatabase()
    const { notifyRecurringChargeSkipped } = useRecurringCreditLimitNotification()

    const transactions = useTransactionsModule(database)
    const recurring = useRecurringTransactionsModule(database, notifyRecurringChargeSkipped)
    const creditCards = useCreditCardModule(database)
    const creditCardTransactions = useCreditCardTransactionsModule(database)
    const budgets = useBudgetsModule(database)

    return useMemo(
        () => ({
            ...transactions,
            ...recurring,
            ...creditCards,
            ...creditCardTransactions,
            ...budgets,
        }),
        [budgets, creditCardTransactions, creditCards, recurring, transactions],
    )
}
