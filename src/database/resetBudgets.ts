import type { SQLiteDatabase } from "expo-sqlite"

import { useBudgetStore } from "@/stores/useBudgetStore"

const BUDGET_SETTING_FILTER =
    "key LIKE 'budget.%' OR key LIKE 'budget:%' OR key LIKE 'budget_%'"

export async function resetBudgets(database: SQLiteDatabase) {
    await database.withTransactionAsync(async () => {
        await database.execAsync(`DELETE FROM settings WHERE ${BUDGET_SETTING_FILTER}`)
    })

    useBudgetStore.getState().clearBudget()

    console.log("Informações de orçamento resetadas")
}
