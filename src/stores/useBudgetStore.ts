import { BudgetPeriod } from "@/types/Transactions"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type StoredBudget = {
    period: BudgetPeriod
    amountCents: number
}

export type BudgetTileMode = "estimatedBalance" | "expensesVsBudget"

type BudgetState = {
    budget: StoredBudget | null
    budgetTileMode: BudgetTileMode
    setBudget: (budget: StoredBudget) => void
    setBudgetTileMode: (budgetTileMode: BudgetTileMode) => void
    clearBudget: () => void
}

const STORAGE_KEY = "@budget"

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set) => ({
            budget: null,
            budgetTileMode: "estimatedBalance",
            setBudget: (budget) => set({ budget }),
            setBudgetTileMode: (budgetTileMode) => set({ budgetTileMode }),
            clearBudget: () => set({ budget: null, budgetTileMode: "estimatedBalance" }),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
