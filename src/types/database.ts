export type SQLiteExecutor = {
    getFirstAsync<T>(sql: string, params?: any[]): Promise<T | undefined | null>
    getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>
    runAsync(sql: string, params?: any[]): Promise<void>
}