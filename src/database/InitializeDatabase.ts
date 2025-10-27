import { SQLiteDatabase } from "expo-sqlite"
import { initializeAppDatabase } from "./useDatabase"

export async function initializeDatabase(database: SQLiteDatabase) {
    await initializeAppDatabase(database)
}
