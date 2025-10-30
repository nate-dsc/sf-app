export type AnalyticsEventName =
    | "credit_limit_validation_failed"
    | "recurring_credit_charge_skipped"

export function trackAnalyticsEvent(eventName: AnalyticsEventName, params?: Record<string, unknown>) {
    const payload = params ? JSON.stringify(params) : "{}"
    console.log(`[analytics] ${eventName}: ${payload}`)
}
