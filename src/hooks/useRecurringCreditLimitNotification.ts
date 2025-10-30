import { useCallback } from "react"

import { useCreditNotificationStore, type RecurringCreditWarning } from "@/stores/useCreditNotificationStore"
import { trackAnalyticsEvent } from "@/utils/analytics"

type NotifyPayload = {
    cardId: number
    cardName?: string | null
    attemptedAmount: number
    availableLimit: number
}

export function useRecurringCreditLimitNotification() {
    const recurringCreditWarning = useCreditNotificationStore((state) => state.recurringCreditWarning)
    const setRecurringCreditWarning = useCreditNotificationStore((state) => state.setRecurringCreditWarning)
    const clearRecurringCreditWarning = useCreditNotificationStore((state) => state.clearRecurringCreditWarning)

    const notifyRecurringChargeSkipped = useCallback((payload: NotifyPayload) => {
        const warning: RecurringCreditWarning = {
            reason: "INSUFFICIENT_CREDIT_LIMIT",
            cardId: payload.cardId,
            cardName: payload.cardName ?? null,
            attemptedAmount: payload.attemptedAmount,
            availableLimit: payload.availableLimit,
            timestamp: new Date().toISOString(),
        }

        setRecurringCreditWarning(warning)
        trackAnalyticsEvent("recurring_credit_charge_skipped", {
            cardId: payload.cardId,
            attemptedAmount: payload.attemptedAmount,
            availableLimit: payload.availableLimit,
        })
    }, [setRecurringCreditWarning])

    const clearNotification = useCallback(() => {
        clearRecurringCreditWarning()
    }, [clearRecurringCreditWarning])

    return {
        warning: recurringCreditWarning,
        notifyRecurringChargeSkipped,
        clearNotification,
    }
}
