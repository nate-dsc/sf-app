import { execFile } from "node:child_process"
import { mkdtempSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

function ensureTerminated(sql: string) {
    const trimmed = sql.trim()
    if (trimmed.startsWith(".")) {
        return trimmed
    }
    return trimmed.endsWith(";") ? trimmed : `${trimmed};`
}

function interpolate(sql: string, params: unknown[]): string {
    let index = 0
    return sql.replace(/\?/g, () => {
        const value = params[index++]
        if (value === null || value === undefined) {
            return "NULL"
        }
        if (typeof value === "number") {
            return value.toString()
        }
        if (typeof value === "boolean") {
            return value ? "1" : "0"
        }
        const stringValue = String(value).replace(/'/g, "''")
        return `'${stringValue}'`
    })
}

export class TestSQLiteDatabase {
    private dbPath: string
    private tempDir: string

    private constructor(tempDir: string, dbPath: string) {
        this.tempDir = tempDir
        this.dbPath = dbPath
    }

    static async create() {
        const tempDir = mkdtempSync(path.join(os.tmpdir(), "sf-sqlite-"))
        const dbPath = path.join(tempDir, "test.db")
        const instance = new TestSQLiteDatabase(tempDir, dbPath)
        await instance.execAsync("PRAGMA foreign_keys = ON;")
        return instance
    }

    async destroy() {
        try {
            rmSync(this.tempDir, { recursive: true, force: true })
        } catch (error) {
            console.warn("Failed to clean up temp sqlite directory", error)
        }
    }

    private async runCommand(commands: string[]): Promise<string> {
        const args = [this.dbPath, "-batch", ...commands.map(ensureTerminated)]
        const { stdout } = await execFileAsync("sqlite3", args)
        return stdout.toString()
    }

    async execAsync(statement: string): Promise<void> {
        await this.runCommand([statement])
    }

    async runAsync(statement: string, params: unknown[] = []): Promise<void> {
        const finalStatement = params.length > 0 ? interpolate(statement, params) : statement
        await this.runCommand([finalStatement])
    }

    async getAllAsync<T>(statement: string, params: unknown[] = []): Promise<T[]> {
        const finalStatement = params.length > 0 ? interpolate(statement, params) : statement
        const output = await this.runCommand([".mode json", finalStatement])
        const trimmed = output.trim()
        if (!trimmed) {
            return []
        }
        return JSON.parse(trimmed) as T[]
    }

    async getFirstAsync<T>(statement: string, params: unknown[] = []): Promise<T | undefined> {
        const rows = await this.getAllAsync<T>(statement, params)
        return rows[0]
    }

    async withTransactionAsync<T>(callback: () => Promise<T>): Promise<T> {
        return callback()
    }
}
