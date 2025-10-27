import AsyncStorage from "@react-native-async-storage/async-storage"
import { BudgetPeriod } from "@/types/transaction"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type StoredBudget = {
    period: BudgetPeriod
    amountCents: number
}

type BudgetState = {
    budget: StoredBudget | null
    setBudget: (budget: StoredBudget) => void
    clearBudget: () => void
}

const STORAGE_KEY = "@budget"

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set) => ({
            budget: null,
            setBudget: (budget) => set({ budget }),
            clearBudget: () => set({ budget: null }),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
