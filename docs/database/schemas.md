# Database Schemas

The application uses a small set of SQLite tables to manage transactions, cards, and recurring billing metadata. The schemas below reflect the tables created in `initializeDatabase` and show the core columns and relationships enforced by foreign keys.

## categories
- **id** (`INTEGER`, primary key)
- **type** (`TEXT`, required) — constrained to `in` or `out` to distinguish income versus expenses.

This table seeds a fixed list of category identifiers and types that other tables reference.

## cards
- **id** (`INTEGER`, primary key)
- **name** (`TEXT`, required)
- **color** (`INT`, required) — UI color identifier for the card.
- **max_limit** (`INT`, required) — credit limit.
- **limit_used** (`INT`, required) — tracked spending against the limit.
- **closing_day** (`INT`, required) — statement closing day of the month.
- **due_day** (`INT`, required) — payment due day of the month.
- **ignore_weekends** (`INTEGER`, default `1`) — flag to adjust due dates that fall on weekends.
- **created_at** (`TEXT`, default `datetime('now')`)
- **updated_at** (`TEXT`, default `datetime('now')`)

Cards represent credit instruments and are referenced by transactions and recurring transactions. Spending functions update `limit_used` to mirror credit utilization.

## transactions_recurring
- **id** (`INTEGER`, primary key)
- **value** (`INTEGER`, required)
- **description** (`TEXT`, optional)
- **category** (`INTEGER`, required) — foreign key to `categories(id)`.
- **date_start** (`TEXT`, required) — first occurrence date.
- **rrule** (`TEXT`, required) — recurrence rule string.
- **date_last_processed** (`TEXT`, optional) — most recent occurrence date generated.
- **card_id** (`INTEGER`, optional) — foreign key to `cards(id)`, set to `NULL` on card deletion.
- **is_installment** (`INTEGER`, default `0`) — differentiates installments from standard recurring charges.
- **type** (`TEXT`, default `out`, constrained to `in` or `out`) — income or expense classification.
- **created_at** (`TEXT`, default `datetime('now')`)

Recurring rows act as blueprints for generating installment or recurring occurrences in the `transactions` table.

## transactions
- **id** (`INTEGER`, primary key)
- **value** (`INTEGER`, required)
- **description** (`TEXT`, optional)
- **category** (`INTEGER`, required) — foreign key to `categories(id)`.
- **date** (`TEXT`, optional) — ISO-like timestamp.
- **id_recurring** (`INTEGER`, optional) — foreign key to `transactions_recurring(id)`, set to `NULL` if the parent is removed.
- **card_id** (`INTEGER`, optional) — foreign key to `cards(id)`.
- **type** (`TEXT`, default `out`, constrained to `in` or `out`)
- **created_at** (`TEXT`, default `datetime('now')`)
- **updated_at** (`TEXT`, default `datetime('now')`)

Each row stores a realized transaction, optionally linked to a recurring blueprint or card. Indices on `date`, `category`, and `card_id` optimize reporting and filtering.
