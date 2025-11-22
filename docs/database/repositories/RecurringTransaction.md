# RecurringTransactionRepository

## Existing functions
### `insertRecurringTransaction(database, data, cardId?)`
Inserts a recurring transaction blueprint into `transactions_recurring`, defaulting the type based on the sign of `value` when none is provided. The function stores recurrence metadata, optional card linkage, and initializes `date_last_processed` as `null`.

### `removeRecurringTransaction(database, id)`
Deletes a recurring blueprint by identifier without touching existing occurrences.

### `removeRecurringTransactionCascade(database, id)`
Within a transaction, deletes all occurrences in `transactions` tied to the blueprint and then removes the recurring row itself.

### `fetchActiveRecurringTransactions(database)`
Returns recurring blueprints that are not marked as installments, allowing the scheduler to process standard recurring charges or incomes.

### `fetchRecurringRule(database, id)`
Retrieves only the recurrence rule string (`rrule`) for a specific recurring transaction.

### `fetchCardSnapshot(database, cardId)`
Fetches a card's limit and name to validate available credit before generating occurrences.

### `fetchRecurringTransactionsForCard(database, cardId)`
Lists recurring transactions linked to a specific card, exposing identifiers, value, rule, start date, and installment flag.

### `fetchInstallmentRecurringTransactions(database)`
Retrieves all recurring blueprints flagged as installments.

### `insertInstallmentRecurringTransaction(database, payload)`
Adds a new installment blueprint with value, description, category, start date, recurrence rule, card association, and type inferred from the value sign.

### `fetchInstallmentBlueprintsWithCardDetails(database, cardId)`
Returns installment blueprints for a card alongside card cycle data and optional category name to support scheduling and UI display.

### `fetchLastInsertedRecurringId(database)`
Reads the most recent `rowid` from SQLite to identify the last inserted recurring blueprint.

### `insertRecurringOccurrence(database, payload)`
Writes a concrete occurrence of a recurring transaction into `transactions`, linking it back to the originating blueprint and optional card.

### `updateRecurringLastProcessed(database, recurringId, processedDate)`
Updates the `date_last_processed` column after generating occurrences, ensuring the scheduler resumes from the latest processed date.

### `fetchRecurringTransactionsByType(database, type)`
Returns recurring blueprints filtered by income (`in`) or expense (`out`).

## Future functions to add
- **`pauseRecurring(database, id)`** — Add a suspended flag and exclude paused blueprints from scheduling until resumed.
- **`projectRecurringCashFlow(database, horizonMonths)`** — Expand active blueprints into a forecast of upcoming occurrences grouped by month and type.
- **`migrateRecurringCard(database, recurringId, newCardId)`** — Reassign a recurring blueprint and its unposted future occurrences to a different card, adjusting `limit_used` deltas as needed.
