# CCTransactionsRepository

## Existing functions
### `insertCardTransaction(database, data, cardId)`
Inserts a one-off card transaction into `transactions` with the provided value, description, category, date, card identifier, and type. The function also increments the card's `limit_used` by the absolute transaction value within the same database transaction to keep spending totals consistent.

## Future functions to add
- **`updateCardTransaction(database, id, changes)`** — Edit a stored card transaction and adjust `limit_used` to reflect any value differences.
- **`deleteCardTransaction(database, id)`** — Remove a card-linked transaction and decrease `limit_used` accordingly to support voids or refunds.
- **`syncCardStatement(database, cardId, cycleStart, cycleEnd)`** — Aggregate posted card transactions into statement records and reconcile `limit_used` with cleared charges.
