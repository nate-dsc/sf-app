export type SQLitePreparedStatement = {
    executeAsync(params?: Record<string, any>): Promise<any>
    finalizeAsync(): Promise<void>
}

export type SQLiteExecutor = {
    prepareAsync(sql: string): Promise<SQLitePreparedStatement>
    runAsync(sql: string, params?: any): Promise<any>
    getFirstAsync<T>(sql: string, params?: any[]): Promise<T | undefined | null>
    getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>
    withTransactionAsync(callback: () => Promise<void>): Promise<void>
}

export type CardSnapshot = { max_limit: number; limit_used: number; name: string | null }
