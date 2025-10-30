import type { SQLiteDatabase } from "expo-sqlite"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useMemo } from "react"

export { initializeAppDatabase } from "./bootstrap"

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
