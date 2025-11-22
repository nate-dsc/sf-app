# CCInstallmentsRepository

## Existing functions
### `insertInstallmentPurchase(database, data, cardId, limitAdjustment)`
Creates a new installment blueprint in `transactions_recurring` and immediately updates the associated card's `limit_used` by the absolute installment value. The operation runs inside a database transaction to keep the blueprint insert and card limit update in sync.

## Future functions to add
- **`syncInstallmentOccurrences(database, recurringId)`** — Generate any missing installment occurrences in `transactions` based on the recurrence rule and update `limit_used` as each slice posts.
- **`reverseInstallment(database, recurringId)`** — Remove pending occurrences for a cancelled installment plan and roll back the card's `limit_used` to reflect the cancelled balance.
- **`updateInstallmentPlan(database, recurringId, updates)`** — Adjust the recurrence rule, value, or category for an existing plan while recalculating remaining installments and credit utilization.
