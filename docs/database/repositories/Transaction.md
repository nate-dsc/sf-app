# TransactionRepository

## Existing functions
### `insertTransactionWithCard(database, data, cardId)`
Inserts a transaction tied to a specific card into `transactions`, defaulting the type to income when the value is non-negative and expense otherwise. Accepts partial recurring or card linkage metadata and writes value, description, category, date, and type.

### `insertTransaction(database, data)`
Creates a non-card transaction using a prepared statement to insert value, description, category, date, and type into `transactions`.

### `deleteTransaction(database, id)`
Deletes a transaction by identifier.

### `fetchTransactionsFromMonth(database, YMString, orderBy)`
Returns all transactions for a given year-month (`YYYY-MM`) ordered either by day of month or by `id`.

### `fetchPaginatedFilteredTransactions(database, page, pageSize, filterOptions)`
Builds a dynamic `SELECT` with text search, category filters, type filters, value ranges, card filters, installment/recurring filters, and date ranges. Sorts by date or value with pagination (`LIMIT`/`OFFSET`).

### `fetchTotalBetween(database, type, startDateISO, endDateISO)`
Aggregates the sum of values for a given type (`in` or `out`) between two dates (inclusive of day) and returns the total.

### `fetchCardCycleTotals(database, cardId, cycleStartKey, cycleEndKey)`
Returns the total absolute value and count of transactions for a card between cycle boundaries, treating expenses as positive amounts for rollups.

### `fetchLastTransaction(database)`
Fetches the most recent transaction ordered by date then `id`.

### `fetchMonthlyCategoryDistribution(database, monthKey, options)`
Joins `transactions` with `categories` to sum values per category for a month, optionally filtered by transaction type.

### `fetchMonthlyOutflowTotals(database, monthKeys)`
For a set of month keys, returns monthly totals of outflow (`type = 'out'`) grouped by month.

### `fetchRecurringOccurrencesDatesInCycle(database, recurringId, cardId, cycleStartKey, cycleEndKey)`
Lists dates of transactions tied to a specific recurring blueprint and card within a date window.

### `fetchRecurringOccurrencesDates(database, recurringId, cardId)`
Lists dates of transactions for a given recurring blueprint and card without windowing.

### `fetchRecurringTransactionsCount(database, recurringId)`
Counts how many transactions have been generated for a specific recurring blueprint.

## Future functions to add
- **`upsertTransactionBatch(database, items)`** — Insert or update multiple transactions in a single transaction to support bulk imports.
- **`recalculateCardTotals(database, cardId)`** — Derive card spending totals from `transactions` to reconcile `limit_used` when manual edits occur.
- **`fetchMonthlyNetByType(database, monthKeys)`** — Return monthly income and expense totals side-by-side to simplify budget dashboards.
- **`reverseRecurringOccurrence(database, transactionId)`** — Remove a mistakenly posted recurring occurrence and decrement related counters or card usage if applicable.
