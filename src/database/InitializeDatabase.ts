import { SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions_recurring (
            id INTEGER NOT NULL PRIMARY KEY,
            value INTEGER NOT NULL,
            description TEXT,
            category INTEGER NOT NULL,
            date_start TEXT NOT NULL,
            rrule TEXT NOT NULL,
            date_last_processed TEXT,
            card_id INTEGER,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
        );   
    `)

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER NOT NULL PRIMARY KEY,
            value INTEGER NOT NULL,
            description TEXT,
            category INTEGER NOT NULL,
            date INTEGER,
            id_recurring INTEGER,
            card_id INTEGER,
            FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL,
            FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
        );   
    `)

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER NOT NULL PRIMARY KEY,
            name TEXT,
            color INT,
            card_limit INT,
            limit_used INT,
            closing_day INT,
            due_day INT,
            ign_wknd BOOLEAN
        );
    `)
} 