import { SQLiteDatabase } from "expo-sqlite";

export async function resetCCDatabase(database: SQLiteDatabase) {

    await database.execAsync(`
        DROP TABLE IF EXISTS cards; 
    `)

    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER NOT NULL PRIMARY KEY,
            name TEXT,
            color INT,
            closing_dayINT,
            due_day INT,
            ign_wknd BOOLEAN
        );
    `)

    console.log("Banco de dados de cartões de crédito resetado")
}