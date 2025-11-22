# CreditCardRepository

## Existing functions
### `insertCard(database, data)`
Creates a new credit card row with the provided name, color, maximum limit, cycle settings, and weekend handling flag. Initializes `limit_used` to zero.

### `updateCardDB(database, cardId, input)`
Dynamically updates card attributes (name, color, limits, cycle days, or weekend handling) based on provided fields and stamps `updated_at`. If no fields are supplied, the function exits without running a query.

### `deleteCardDB(database, cardId)`
Removes a card row by identifier.

### `fetchCard(database, cardId)`
Retrieves a single card with its limits, cycle configuration, and color metadata. Returns `null` when no match is found.

### `fetchCards(database)`
Returns all cards with limit information and cycle settings.

### `updateCardLimitUsed(database, cardId, limitAdjustment)`
Adjusts a card's `limit_used` by a positive or negative delta, supporting manual corrections to available credit.

### `fetchCardInstallmentSnapshot(database, cardId)`
Fetches limit and cycle metadata needed to plan installment schedules, including `max_limit`, `limit_used`, `closing_day`, `due_day`, and `ignore_weekends`.

### `fetchCardDueDay(database, cardId)`
Returns only the due day for quick bill reminders.

### `fetchByAvailableLimit(database, necessaryAmount)`
Lists cards whose remaining limit (`max_limit - limit_used`) exceeds the requested amount, aiding card selection for new purchases.

## Future functions to add
- **`archiveCard(database, cardId)`** — Soft-delete or archive a card while preserving historical transactions and statements.
- **`resetCardLimitUsed(database, cardId)`** — Zero out `limit_used` at the start of a billing cycle and optionally snapshot prior usage.
- **`fetchCardCycleWindow(database, cardId, asOfDate)`** — Compute the current cycle start/end dates and due date for display and reconciliation tasks.
