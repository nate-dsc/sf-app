/* import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type RecurringCreditWarning = {
    reason: "INSUFFICIENT_CREDIT_LIMIT"
    cardId: number
    cardName?: string | null
    attemptedAmount: number
    availableLimit: number
    timestamp: string
}

type CreditNotificationState = {
    recurringCreditWarning?: RecurringCreditWarning
    setRecurringCreditWarning: (warning: RecurringCreditWarning) => void
    clearRecurringCreditWarning: () => void
}

const STORAGE_KEY = "@credit-notifications"

export const useCreditNotificationStore = create<CreditNotificationState>()(
    persist(
        (set) => ({
            recurringCreditWarning: undefined,
            setRecurringCreditWarning: (warning) => set({ recurringCreditWarning: warning }),
            clearRecurringCreditWarning: () => set({ recurringCreditWarning: undefined }),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
 */