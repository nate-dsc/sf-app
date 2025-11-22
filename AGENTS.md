# AGENTS – Simple Finance Repo Guidance

## 1) Overview
- Expo/React Native app for personal finance with tabs for Home, History, and Planning plus stack screens for settings, credit cards, recurring income/expense, budget, distribution, and projections. Navigation lives in `src/app/_layout.tsx` and `src/app/(tabs)/_layout.tsx` using Expo Router stacks/tabs and shared theme/header providers.
- State and theming come from React context providers (`StyleContext`, `HeaderConfigContext`, `NewTransactionContext`, `SearchFiltersContext`) and Zustand stores (`useSummaryStore`, `useDistributionStore`, `useBudgetStore`). Summary and distribution stores hydrate from SQLite at startup and persist via AsyncStorage.
- Data is stored locally in SQLite through `expo-sqlite`. `useTransactionDatabase` composes feature modules (transactions, recurring, credit cards, installment purchases, budgets) which delegate to repository functions that run SQL and enforce business rules.

## 2) Architectural layers
- **Screens & navigation (`src/app`)**: Expo Router folders `(tabs)/(home|history|planning)`, `(credit)`, `(recurring)`, `(budget)`, plus standalone screens (distribution, planPurchase, etc.). `src/app/_layout.tsx` wires providers, runs pending recurring/installment sync on mount, and refreshes summary/distribution stores.
- **Context providers (`src/context`)**: Theme/header/search/new-transaction contexts configure UI theming and screen header metadata. Providers are expected to wrap the navigation tree in `_layout.tsx`.
- **Stores (`src/stores`)**: Zustand stores hold derived data (summary, distribution, budget). Many use `persist` with AsyncStorage; refresh is controlled by toggling a `refreshKey` and calling `loadData` with DB helpers.
- **Database layer (`src/database`)**:
  - `initializeDatabase` and `useDatabase` set up the SQLite connection and helper utilities.
  - `useTransactionDatabase` aggregates modules to expose a single API to the UI layer.
  - **Modules (`src/database/modules`)** encapsulate business flows (transactions, recurring transactions, credit cards, credit-card transactions/recurrences, installment purchases, budgets). Each module wraps repository calls, performs credit limit validation, and may run multi-step transactions.
  - **Repositories (`src/database/repositories`)** contain raw SQL operations for specific tables (transactions, recurring blueprints, credit cards, installment schedules) and utility queries (cycle totals, projections, RRULE fetches).
- **Components (`src/components`)**: UI pieces for navigation, pickers, grouped lists, home/planning/history items, recurrence modals, credit card widgets, etc. Styling helpers live in `src/components/styles` and `src/styles`.
- **Hooks/Utils (`src/hooks`, `src/utils`)**: Cross-cutting helpers (e.g., recurring credit limit notifications, date/category utilities) used by modules and UI.

## 3) Data flow & database access
- UI interactions invoke functions from `useTransactionDatabase` or module-specific hooks. Modules call repository functions with an open `SQLiteDatabase` instance from `useDatabase`/`SQLiteProvider`.
- Recurring and installment sync is triggered on app mount in `src/app/_layout.tsx` and writes generated occurrences into `transactions`, updating card `limit_used` when applicable. Summary/distribution stores then reload from DB.
- Credit card spending and installment logic run inside `database.withTransactionAsync` blocks when multiple writes are required (e.g., generating occurrences and updating `limit_used`). Respect these transactional boundaries to avoid inconsistent card limits or partial inserts.

## 4) Rules for refactoring & safe behavior
- Keep provider wiring in `_layout.tsx` intact (SQLiteProvider → Style/Header/NewTransaction/Search contexts → Navigation). Do not reorder providers unless you verify hook dependencies.
- Preserve module boundaries: UI should call module functions; modules should call repositories; repositories are the only layer issuing SQL. Avoid bypassing modules when adding features because they contain validation, logging, and limit adjustments.
- Maintain UTC/local date handling in recurring/installment logic (`localToUTC`, `toISOString().slice`, zeroed hours). Do not change date slicing formats without auditing RRULE computations and SQLite date columns.
- When altering credit card flows, always adjust `limit_used` through provided helpers (`updateCardLimitUsed`) and ensure limits are checked before inserts.
- Persisted stores rely on AsyncStorage keys (`@summary`, etc.). Changing keys or shapes requires migration code to avoid crashing hydration.

## 5) Do’s and Don’ts
- **Do** reuse existing hooks/utilities for date math, category lookup, and theme retrieval to keep UI consistent.
- **Do** keep RRULE generation/parsing with the `rrule` library; validate recurrence options before persisting.
- **Do** keep SQL changes inside repositories and update related docs under `docs/database` if schemas or queries change.
- **Don’t** add try/catch around imports (project guideline) or silent-fail database writes—propagate or log errors consistently like existing modules.
- **Don’t** bypass card limit checks when inserting recurring/transaction/installment rows.
- **Don’t** break hook call order or move hooks inside conditionals; contexts/hooks follow React rules of hooks.

## 6) Fragile subsystems & warnings
- **Recurring transaction sync (`recurringTransactionsModule`)**: Uses RRULE to find pending occurrences between `date_last_processed`/`date_start` and end-of-day. Adjusts card limits for expenses and updates `date_last_processed` only after successful inserts. Any refactor must preserve transaction boundaries and limit checks/notifications.
- **Recurring credit card checks (`CCTransactionsRecurringModule`)**: Validates available limit before inserting a recurring card charge. Skipping this check can overrun credit limits.
- **Installment purchases (`CCInstallmentsModule`)**: Compares available limit against total installment cost (`value * installmentCounts`) before inserting. Synchronization logic later generates occurrences and requires card metadata; ensure due-day calculations and card existence checks remain intact.
- **Card statement calculations (`creditCardModule`)**: Cycle boundaries depend on `closing_day`, due-date adjustment for weekends, and projections combining realized totals with pending recurring/installment amounts. Changing date math can corrupt statements or limit usage.
- **Budget/summary loading (`budgetModule`, stores)**: Summary store refresh depends on `refreshKey` toggling and AsyncStorage persistence. Avoid side effects that desynchronize the store from DB functions.

## 7) Safe use of /plan
- When using `/plan`, keep steps concise and tied to modules/paths (e.g., specify repositories or modules to touch). Plans should honor the provider/module boundaries and the fragile subsystems noted above.

## 8) High-risk logic to understand before editing
- **RRULE handling**: Recurrence rules are parsed with `RRule.parseString` and executed with date windows; start dates are set with UTC suffixes to avoid timezone drift.
- **Credit limit validation**: Card flows compute `availableLimit = max_limit - limit_used` and block inserts when insufficient. `limit_used` is incremented/decremented inside transactions to stay in sync with generated occurrences.
- **Installment generation**: Installment sync loops use purchase-day and due-day calculations and ignore blueprints without cards. Breaks here can create missing charges or orphaned records.
- **Summary/distribution hydration**: Home dashboard relies on DB totals (`fetchTotalBetween`, `fetchMonthlyCategoryDistribution`) and must stay consistent with transaction inserts/removals.

## 9) Legacy/deprecated notes
- Comment blocks in `CCInstallmentsModule` and `creditCardModule` contain older/full implementations for installment scheduling and statement mapping. Treat them as historical references; do not revive or partially copy without reconciling with current simplified logic.

## 10) Future guidance for AI development
- Add new features by extending modules and repositories rather than embedding SQL in components.
- Introduce new fragile logic (e.g., more recurrence types, card fees) behind dedicated helpers with unitable date/limit math to avoid regressions.
- Update database docs under `docs/database` when schemas or repository behaviors change so future agents understand constraints.
- Keep PR summaries specific: mention affected modules, data-layer changes, and any migration considerations.
