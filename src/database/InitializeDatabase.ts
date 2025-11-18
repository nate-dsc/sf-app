import { dropAll } from "@/database/reset/resetDatabase";
import { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    
    await dropAll(database)

    const pragmaForeignKeysOn = `PRAGMA foreign_keys = ON;`

    const createCategoriesTableStatement = `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL DEFAULT 'out' CHECK (type IN ('in', 'out'))
    );`

    const seedCategoriesTableStatement = `INSERT OR IGNORE INTO categories (id, type) VALUES
        (1, 'out'),
        (2, 'out'),
        (3, 'out'),
        (4, 'out'),
        (5, 'out'),
        (6, 'out'),
        (7, 'out'),
        (8, 'out'),
        (9, 'out'),
        (10, 'out'),
        (11, 'out'),
        (12, 'out'),
        (13, 'out'),
        (14, 'out'),
        (15, 'out'),
        (16, 'out'),
        (21, 'in'),
        (22, 'in'),
        (23, 'in'),
        (24, 'in'),
        (25, 'in'),
        (26, 'in'),
        (27, 'in'),
        (28, 'in'),
        (29, 'in')
    ;`
        
    const createCardsTableStatement = `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        color INT,
        max_limit INT NOT NULL DEFAULT 0,
        limit_used INT NOT NULL DEFAULT 0,
        closing_day INT,
        due_day INT,
        ignore_weekends INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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
        type TEXT NOT NULL DEFAULT 'out' CHECK (type IN ('in','out')),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
        );`
        
        
    const createTransactionsTableStatement = `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        value INTEGER NOT NULL,
        description TEXT,
        category INTEGER NOT NULL,
        date TEXT,
        id_recurring INTEGER,
        card_id INTEGER,
        type TEXT NOT NULL DEFAULT 'out' CHECK (type IN ('in','out')),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (category) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
    );`
        
        
    const initStatements = [
        pragmaForeignKeysOn,
        createCategoriesTableStatement,
        seedCategoriesTableStatement,
        createCardsTableStatement,
        createTransactionsRecurringTableStatement,
        createTransactionsTableStatement
    ]

    for (const statement of initStatements) {
        await database.execAsync(statement)
    }

    console.log("Banco inicializado")

}


