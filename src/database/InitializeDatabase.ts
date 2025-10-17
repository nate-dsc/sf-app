import { SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions_recurring (
            id INTEGER NOT NULL PRIMARY KEY,
            value INTEGER NOT NULL,
            description TEXT,
            category INTEGER NOT NULL,
            date_start TEXT NOT NULL,
            RRULE TEXT NOT NULL,
            date_last_processed TEXT
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
            FOREIGN KEY (id_recurring) REFERENCES transactions_recurring(id) ON DELETE SET NULL
        );   
    `)
}