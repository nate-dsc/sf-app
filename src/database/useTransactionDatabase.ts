import { useMemo } from "react"

import { useBudgetsModule } from "./modules/BudgetModule"
import { useCCInstallmentsModule } from "./modules/CCInstallmentsModule"
import { useCCTransactionsModule } from "./modules/CCTransactionsModule"
import { useCCTransactionsRecurringModule } from "./modules/CCTransactionsRecurringModule"
import { useCreditCardModule } from "./modules/CreditCardModule"
import { useRecurringTransactionsModule } from "./modules/RecurringTransactionsModule"
import { useTransactionsModule } from "./modules/TransactionsModule"
import { useDatabase } from "./useDatabase"

export function useTransactionDatabase() {
    const { database } = useDatabase()

    const transactions = useTransactionsModule(database)
    const recurring = useRecurringTransactionsModule(database)
    const creditCards = useCreditCardModule(database)
    const creditCardTransactions = useCCTransactionsModule(database)
    const creditCardTransactionsRecurring = useCCTransactionsRecurringModule(database)
    const creditCardInstallments = useCCInstallmentsModule(database)
    const budgets = useBudgetsModule(database)

    return useMemo(
        () => ({
            ...transactions,
            ...recurring,
            ...creditCards,
            ...creditCardTransactions,
            ...creditCardTransactionsRecurring,
            ...creditCardInstallments,
            ...budgets,
        }),
        [budgets, creditCardInstallments, creditCardTransactionsRecurring, creditCardTransactions, creditCards, recurring, transactions],
    )
}
