export type DatabaseExecutor = {
    execAsync: (statement: string) => Promise<void>
    runAsync?: (statement: string, params?: unknown[]) => Promise<void>
    getFirstAsync: <T>(statement: string, params?: unknown[]) => Promise<T | undefined | null>
    getAllAsync: <T>(statement: string, params?: unknown[]) => Promise<T[]>
    withTransactionAsync: <T>(callback: () => Promise<T>) => Promise<T>
}

export async function initializeAppDatabase(database: DatabaseExecutor) {
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
                    "limit" INT NOT NULL DEFAULT 0,
                    limit_used INT NOT NULL DEFAULT 0,
                    closing_day INT,
                    due_day INT,
                    ignore_weekends INTEGER NOT NULL DEFAULT 0,
                    issuer TEXT,
                    last_four TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );`,
                `CREATE INDEX IF NOT EXISTS idx_cards_limit_usage ON cards("limit", limit_used);`,
                `CREATE INDEX IF NOT EXISTS idx_cards_cycle_days ON cards(closing_day, due_day);`,
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
                    flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
                    notes TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
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
                    flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
                    notes TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
                    FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
                    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
                );`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_card ON transactions(card_id);`,
                `CREATE INDEX IF NOT EXISTS idx_transactions_card_date ON transactions(card_id, date);`,
                `CREATE INDEX IF NOT EXISTS idx_card_statements_card_cycle ON card_statements(card_id, cycle_start, cycle_end);`,
                `CREATE INDEX IF NOT EXISTS idx_card_statements_card_due ON card_statements(card_id, due_date);`,
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
                    (29, 'Outros (entrada)', 'other-income', 'inflow', '#94A3B8', 'ellipsis-horizontal', 0, datetime('now'));`
            ],
        },
        {
            id: 3,
            name: "drop-unused-tables",
            statements: [
                `DROP TABLE IF EXISTS attachments;`,
                `DROP TABLE IF EXISTS payees;`,
                `DROP TABLE IF EXISTS audit_trail;`,
            ],
        },
    ]

    const createTransactionsTableStatement = `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        value INTEGER NOT NULL,
        description TEXT,
        category INTEGER NOT NULL,
        date TEXT,
        id_recurring INTEGER,
        card_id INTEGER,
        account_id INTEGER,
        flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
    );`

    const createTransactionsRecurringTableStatement = `CREATE TABLE IF NOT EXISTS transactions_recurring (
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
        flow TEXT NOT NULL DEFAULT 'outflow' CHECK (flow IN ('inflow','outflow')),
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
    );`

    const ensureTransactionsRecurringSchema = async () => {
        const columns = await database.getAllAsync<{ name: string }>("PRAGMA table_info(transactions_recurring)")

        const hasPayee = columns.some((column) => column.name === "payee_id")

        if (hasPayee) {
            await database.withTransactionAsync(async () => {
                await database.execAsync("ALTER TABLE transactions_recurring RENAME TO transactions_recurring_legacy")
                await database.execAsync(createTransactionsRecurringTableStatement)

                await database.execAsync(`
                    INSERT INTO transactions_recurring (id, value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, account_id, flow, notes, created_at)
                    SELECT id, value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, account_id, flow, notes, created_at
                    FROM transactions_recurring_legacy;
                `)

                await database.execAsync("DROP TABLE transactions_recurring_legacy")
            })
        } else {
            await database.execAsync(createTransactionsRecurringTableStatement)
        }

        await database.execAsync(
            "CREATE INDEX IF NOT EXISTS idx_transactions_recurring_next_run ON transactions_recurring(date_start);"
        )
    }

    const ensureTransactionsSchema = async () => {
        const columns = await database.getAllAsync<{ name: string }>("PRAGMA table_info(transactions)")

        const hasPayee = columns.some((column) => column.name === "payee_id")

        if (hasPayee) {
            await database.withTransactionAsync(async () => {
                await database.execAsync("ALTER TABLE transactions RENAME TO transactions_legacy")
                await database.execAsync(createTransactionsTableStatement)

                await database.execAsync(`
                    INSERT INTO transactions (id, value, description, category, date, id_recurring, card_id, account_id, flow, notes, created_at, updated_at)
                    SELECT id, value, description, category, date, id_recurring, card_id, account_id, flow, notes, created_at, updated_at
                    FROM transactions_legacy;
                `)

                await database.execAsync("DROP TABLE transactions_legacy")
            })
        } else {
            await database.execAsync(createTransactionsTableStatement)
        }

        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);")
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);")
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_transactions_card ON transactions(card_id);")
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_transactions_card_date ON transactions(card_id, date);")
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);")
    }

    const ensureCardSchema = async () => {
        const existingTable = await database.getFirstAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name = 'cards'"
        )

        const createCardsTableStatement = `CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            color INT,
            "limit" INT NOT NULL DEFAULT 0,
            limit_used INT NOT NULL DEFAULT 0,
            closing_day INT,
            due_day INT,
            ignore_weekends INTEGER NOT NULL DEFAULT 0,
            issuer TEXT,
            last_four TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );`

        if (!existingTable) {
            await database.execAsync(createCardsTableStatement)
        } else {
            const columns = await database.getAllAsync<{ name: string }>("PRAGMA table_info(cards)")

            const columnNames = new Set(columns.map((column) => column.name))

            const hasLegacyLimit = columnNames.has("card_limit")
            const missingLimit = !columnNames.has("limit")
            const hasLegacyWeekend = columnNames.has("ign_wknd")
            const missingWeekend = !columnNames.has("ignore_weekends")
            const missingUpdatedAt = !columnNames.has("updated_at")

            if (hasLegacyLimit || missingLimit || hasLegacyWeekend || missingWeekend || missingUpdatedAt) {
                await database.withTransactionAsync(async () => {
                    await database.execAsync("ALTER TABLE cards RENAME TO cards_legacy")
                    await database.execAsync(createCardsTableStatement)

                    const legacyColumns = new Set(
                        (await database.getAllAsync<{ name: string }>("PRAGMA table_info(cards_legacy)")).map(
                            (column) => column.name
                        )
                    )

                    const selectLimit = legacyColumns.has("limit")
                        ? '"limit"'
                        : legacyColumns.has("card_limit")
                            ? "card_limit"
                            : "0"
                    const selectIgnoreWeekends = legacyColumns.has("ignore_weekends")
                        ? "ignore_weekends"
                        : legacyColumns.has("ign_wknd")
                            ? "ign_wknd"
                            : "0"
                    const selectColor = legacyColumns.has("color") ? "color" : "NULL"
                    const selectLimitUsed = legacyColumns.has("limit_used") ? "limit_used" : "0"
                    const selectClosing = legacyColumns.has("closing_day") ? "closing_day" : "NULL"
                    const selectDue = legacyColumns.has("due_day") ? "due_day" : "NULL"
                    const selectIssuer = legacyColumns.has("issuer") ? "issuer" : "NULL"
                    const selectLastFour = legacyColumns.has("last_four") ? "last_four" : "NULL"
                    const selectCreatedAt = legacyColumns.has("created_at") ? "created_at" : "datetime('now')"
                    const selectUpdatedAt = legacyColumns.has("updated_at") ? "updated_at" : selectCreatedAt

                    await database.execAsync(`
                        INSERT INTO cards (id, name, color, "limit", limit_used, closing_day, due_day, ignore_weekends, issuer, last_four, created_at, updated_at)
                        SELECT id, name, ${selectColor}, ${selectLimit}, ${selectLimitUsed}, ${selectClosing}, ${selectDue}, COALESCE(${selectIgnoreWeekends}, 0), ${selectIssuer}, ${selectLastFour}, ${selectCreatedAt}, COALESCE(${selectUpdatedAt}, ${selectCreatedAt})
                        FROM cards_legacy;
                    `)

                    await database.execAsync("DROP TABLE cards_legacy")
                })
            }

            await database.execAsync(createCardsTableStatement)
        }

        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_cards_limit_usage ON cards(\"limit\", limit_used);")
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_cards_cycle_days ON cards(closing_day, due_day);")
        await database.execAsync(
            "CREATE INDEX IF NOT EXISTS idx_card_statements_card_cycle ON card_statements(card_id, cycle_start, cycle_end);"
        )
        await database.execAsync("CREATE INDEX IF NOT EXISTS idx_card_statements_card_due ON card_statements(card_id, due_date);")
        await database.execAsync(
            "UPDATE cards SET ignore_weekends = COALESCE(ignore_weekends, 0), updated_at = COALESCE(updated_at, created_at)"
        )
    }

    for (const migration of MIGRATIONS) {
        for (const statement of migration.statements) {
            await database.execAsync(statement)
        }
    }

    await ensureTransactionsRecurringSchema()
    await ensureTransactionsSchema()
    await ensureCardSchema()

    console.log("✅ Banco inicializado com sucesso!")
}
