# CCTransactionsRecurringRepository

## Existing functions
### `insertCardTransactionRecurring(database, data, cardId)`
Creates a recurring credit card blueprint in `transactions_recurring` and increments the card's `limit_used` by the absolute value inside a transaction. The stored row keeps the recurrence rule, starting date, description, category, and type, flagged as a non-installment recurring charge.

## Future functions to add
- **`generateRecurringOccurrences(database, cardId, asOfDate)`** — Expand recurring blueprints into concrete `transactions` up to a cutoff date while preserving `limit_used` accuracy.
- **`pauseRecurringTransaction(database, recurringId)`** — Temporarily disable a recurring rule without deleting historical occurrences.
- **`migrateRecurringToInstallment(database, recurringId, installmentConfig)`** — Convert an existing recurring charge into an installment plan, updating `is_installment` and any associated schedule details.
