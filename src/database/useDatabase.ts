import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo } from "react";

export async function initializeAppDatabase(database: SQLiteDatabase) {

    const MIGRATIONS = [
        {
            id: 1,
            name: "create-core-ledger-tables",
            statements: [
                `CREATE TABLE IF NOT EXISTS accounts (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL CHECK (type IN ('checking','savings','cash','investment','credit','wallet')),
                    currency TEXT NOT NULL DEFAULT 'BRL',
                    color TEXT,
                    icon TEXT,
                    is_archived INTEGER NOT NULL DEFAULT 0,
                    initial_balance INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS account_balances (
                    id INTEGER PRIMARY KEY,
                    account_id INTEGER NOT NULL,
                    balance INTEGER NOT NULL,
                    as_of TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
                    UNIQUE (account_id, as_of)
                );`,
                `CREATE INDEX IF NOT EXISTS idx_account_balances_account_date ON account_balances(account_id, as_of);`,
                `CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    slug TEXT NOT NULL UNIQUE,
                    flow TEXT NOT NULL CHECK (flow IN ('inflow','outflow')),
                    color TEXT,
                    icon TEXT,
                    is_archived INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS payees (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    type TEXT NOT NULL DEFAULT 'generic',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    color TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    color INT,
                    card_limit INT,
                    limit_used INT NOT NULL DEFAULT 0,
                    closing_day INT,
                    due_day INT,
                    ign_wknd INTEGER,
                    issuer TEXT,
                    last_four TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS card_statements (
                    id INTEGER PRIMARY KEY,
                    card_id INTEGER NOT NULL,
                    cycle_start TEXT NOT NULL,
                    cycle_end TEXT NOT NULL,
                    due_date TEXT NOT NULL,
                    closing_balance INTEGER NOT NULL DEFAULT 0,
                    paid INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
                    UNIQUE (card_id, cycle_start)
                );`,
                `CREATE TABLE IF NOT EXISTS transactions_recurring (
                    id INTEGER PRIMARY KEY,
                    value INTEGER NOT NULL,
                    description TEXT,
                    category INTEGER NOT NULL,
                    date_start TEXT NOT NULL,
                    rrule TEXT NOT NULL,
                    date_last_processed TEXT,
                    card_id INTEGER,
                    is_installment INTEGER NOT NULL DEFAULT 0,
                    account_id INTEGER,
                    payee_id INTEGER,
                    flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
                    notes TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
                    FOREIGN KEY (payee_id) REFERENCES payees(id) ON DELETE SET NULL
                );`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_recurring_next_run ON transactions_recurring(date_start);`,
                `CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY,
                    value INTEGER NOT NULL,
                    description TEXT,
                    category INTEGER NOT NULL,
                    date TEXT,
                    id_recurring INTEGER,
                    card_id INTEGER,
                    account_id INTEGER,
                    payee_id INTEGER,
                    flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
                    notes TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
                    FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
                    FOREIGN KEY (payee_id) REFERENCES payees(id) ON DELETE SET NULL
                );`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_card ON transactions(card_id);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);`,
                `CREATE TABLE IF NOT EXISTS card_statement_transactions (
                    statement_id INTEGER NOT NULL,
                    transaction_id INTEGER NOT NULL,
                    PRIMARY KEY (statement_id, transaction_id),
                    FOREIGN KEY (statement_id) REFERENCES card_statements(id) ON DELETE CASCADE,
                    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
                );`,
                `CREATE TABLE IF NOT EXISTS transaction_tags (
                    transaction_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL,
                    PRIMARY KEY (transaction_id, tag_id),
                    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );`,
                `CREATE TABLE IF NOT EXISTS attachments (
                    id INTEGER PRIMARY KEY,
                    transaction_id INTEGER NOT NULL,
                    uri TEXT NOT NULL,
                    type TEXT NOT NULL,
                    uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
                );`,
                `CREATE TABLE IF NOT EXISTS budgets (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    category_id INTEGER,
                    period TEXT NOT NULL CHECK (period IN ('weekly','monthly','quarterly','yearly','custom')),
                    amount INTEGER NOT NULL,
                    start_date TEXT NOT NULL,
                    end_date TEXT,
                    rollover INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                );`,
                `CREATE TABLE IF NOT EXISTS budget_allocations (
                    id INTEGER PRIMARY KEY,
                    budget_id INTEGER NOT NULL,
                    transaction_id INTEGER,
                    amount INTEGER NOT NULL,
                    allocated_at TEXT NOT NULL DEFAULT (datetime('now')),
                    notes TEXT,
                    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
                    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
                );`,
                `CREATE TABLE IF NOT EXISTS savings_goals (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    target_amount INTEGER NOT NULL,
                    current_amount INTEGER NOT NULL DEFAULT 0,
                    target_date TEXT,
                    account_id INTEGER,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
                );`,
                `CREATE TABLE IF NOT EXISTS goal_contributions (
                    id INTEGER PRIMARY KEY,
                    goal_id INTEGER NOT NULL,
                    transaction_id INTEGER,
                    amount INTEGER NOT NULL,
                    contributed_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (goal_id) REFERENCES savings_goals(id) ON DELETE CASCADE,
                    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
                );`,
                `CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE TABLE IF NOT EXISTS audit_trail (
                    id INTEGER PRIMARY KEY,
                    entity TEXT NOT NULL,
                    entity_id INTEGER NOT NULL,
                    change_type TEXT NOT NULL,
                    payload TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `DROP TABLE IF EXISTS installment_purchases;`
            ],
        },
        {
            id: 2,
            name: "seed-default-categories",
            statements: [
                `INSERT OR IGNORE INTO categories (id, name, slug, flow, color, icon, is_archived, created_at)
                VALUES
                    (1, 'Moradia', 'housing', 'outflow', '#0EA5E9', 'home', 0, datetime('now')),
                    (2, 'Alimentação', 'eating-out', 'outflow', '#FB7185', 'restaurant', 0, datetime('now')),
                    (3, 'Mercado', 'groceries', 'outflow', '#F97316', 'cart', 0, datetime('now')),
                    (4, 'Transporte', 'transport', 'outflow', '#10B981', 'car', 0, datetime('now')),
                    (5, 'Serviços', 'services', 'outflow', '#8B5CF6', 'construct', 0, datetime('now')),
                    (6, 'Lazer', 'leisure', 'outflow', '#F59E0B', 'ticket', 0, datetime('now')),
                    (7, 'Educação', 'education', 'outflow', '#22D3EE', 'school', 0, datetime('now')),
                    (8, 'Compras', 'shopping', 'outflow', '#EC4899', 'bag-handle', 0, datetime('now')),
                    (9, 'Investimentos', 'investments', 'outflow', '#22C55E', 'trending-up', 0, datetime('now')),
                    (10, 'Saúde', 'health', 'outflow', '#EF4444', 'fitness', 0, datetime('now')),
                    (11, 'Emergências', 'emergency', 'outflow', '#FACC15', 'medical', 0, datetime('now')),
                    (12, 'Viagens', 'travel', 'outflow', '#38BDF8', 'airplane', 0, datetime('now')),
                    (13, 'Pets', 'pets', 'outflow', '#D946EF', 'paw', 0, datetime('now')),
                    (14, 'Games', 'gaming', 'outflow', '#4ADE80', 'game-controller', 0, datetime('now')),
                    (15, 'Apostas', 'gambling', 'outflow', '#FB923C', 'dice', 0, datetime('now')),
                    (16, 'Outros', 'other-expenses', 'outflow', '#94A3B8', 'ellipsis-horizontal', 0, datetime('now')),
                    (21, 'Salário', 'salary', 'inflow', '#22C55E', 'cash', 0, datetime('now')),
                    (22, 'Freelance', 'freelance', 'inflow', '#14B8A6', 'hammer', 0, datetime('now')),
                    (23, 'Plantão', 'on-call', 'inflow', '#6366F1', 'id-card', 0, datetime('now')),
                    (24, 'Hora extra', 'overtime', 'inflow', '#E879F9', 'time', 0, datetime('now')),
                    (25, 'Per diem', 'per-diem', 'inflow', '#F97316', 'today', 0, datetime('now')),
                    (26, 'Vendas', 'sales', 'inflow', '#0EA5E9', 'pricetag', 0, datetime('now')),
                    (27, 'Retorno investimentos', 'roi', 'inflow', '#FBBF24', 'trending-up', 0, datetime('now')),
                    (28, 'Apostas (entrada)', 'gambling-income', 'inflow', '#A855F7', 'dice', 0, datetime('now')),
                    (29, 'Outros (entrada)', 'other-income', 'inflow', '#94A3B8', 'ellipsis-horizontal', 0, datetime('now'));
                `,
            ],
        },
    ]

    for (const migration of MIGRATIONS) {
        for (const statement of migration.statements) {
            await database.execAsync(statement);
        }
    }

    console.log("✅ Banco inicializado com sucesso!");
}

export type DatabaseHelpers = {
    database: SQLiteDatabase
    ready: Promise<void>
    listTables: () => Promise<{ name: string }[]>
    getTableRowCount: (table: string) => Promise<number>
    resetData: () => Promise<void>
}

export function useDatabase(): DatabaseHelpers {
    const database = useSQLiteContext()
    const ready = useMemo(() => Promise.resolve(), [])

    const listTables = useCallback(async () => {
        await ready
        return database.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
    }, [database, ready])

    const getTableRowCount = useCallback(async (table: string) => {
        await ready
        const quoted = `"${table.replace(/"/g, '""')}"`
        const result = await database.getFirstAsync<{ total: number }>(
            `SELECT COUNT(*) as total FROM ${quoted}`
        )

        return result?.total ?? 0
    }, [database, ready])

    const resetData = useCallback(async () => {
        await ready

        await database.withTransactionAsync(async () => {
            const tables = await database.getAllAsync<{ name: string }>(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT IN ('migrations')"
            )

            for (const table of tables) {
                const quoted = `"${table.name.replace(/"/g, '""')}"`
                await database.execAsync(`DELETE FROM ${quoted}`)
            }
        })
    }, [database, ready])

    return useMemo(() => ({
        database,
        ready,
        listTables,
        getTableRowCount,
        resetData,
    }), [database, getTableRowCount, listTables, ready, resetData])
}
