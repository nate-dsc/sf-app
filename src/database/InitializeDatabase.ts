import { SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value INTEGER NOT NULL,
            description TEXT,
            category INTEGER NOT NULL,
            base_date INTEGER,
            is_repeating INTEGER DEFAULT FALSE,
            rrule TEXT,
        );   
    `)
}