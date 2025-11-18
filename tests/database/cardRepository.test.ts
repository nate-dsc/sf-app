import assert from "node:assert/strict"
import { afterEach, beforeEach, describe, it } from "node:test"

import { initializeAppDatabase } from "../../src/database/bootstrap"
import { computeDueDate, getCardStatementForDate, getCardStatementHistory, resolveCycleBoundaries, updateCardRecord } from "../../src/database/repositories/cardRepository"
import { TestSQLiteDatabase } from "../utils/createTestDatabase"

let database: TestSQLiteDatabase

beforeEach(async () => {
    database = await TestSQLiteDatabase.create()
    await initializeAppDatabase(database as unknown as any)
})

afterEach(async () => {
    await database.destroy()
})

describe("card repository helpers", () => {
    it("ensures cards table schema and indexes are up to date", async () => {
        const columns = await database.getAllAsync<{ name: string }>("PRAGMA table_info(cards)")
        const columnNames = columns.map((column) => column.name)

        assert(columnNames.includes("limit"))
        assert(columnNames.includes("limit_used"))
        assert(columnNames.includes("closing_day"))
        assert(columnNames.includes("due_day"))
        assert(columnNames.includes("ignore_weekends"))
        assert(columnNames.includes("updated_at"))
        assert(!columnNames.includes("card_limit"))
        assert(!columnNames.includes("ign_wknd"))

        const cardIndexes = await database.getAllAsync<{ name: string }>("PRAGMA index_list(cards)")
        const cardIndexNames = cardIndexes.map((index) => index.name)
        assert(cardIndexNames.includes("idx_cards_limit_usage"))
        assert(cardIndexNames.includes("idx_cards_cycle_days"))

        const statementIndexes = await database.getAllAsync<{ name: string }>("PRAGMA index_list(card_statements)")
        const statementIndexNames = statementIndexes.map((index) => index.name)
        assert(statementIndexNames.includes("idx_card_statements_card_cycle"))
        assert(statementIndexNames.includes("idx_card_statements_card_due"))
    })

    it("calculates cycle boundaries and statement totals", async () => {
        await database.runAsync(
            "INSERT INTO cards (id, name, color, \"limit\", limit_used, closing_day, due_day, ignore_weekends) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [1, "Primary", 2, 100000, 45000, 20, 10, 1],
        )

        await database.runAsync(
            "INSERT INTO transactions (value, description, category, date, card_id, flow) VALUES (?, ?, ?, ?, ?, ?)",
            [-1000, "Groceries", 1, "2024-04-25", 1, "outflow"],
        )
        await database.runAsync(
            "INSERT INTO transactions (value, description, category, date, card_id, flow) VALUES (?, ?, ?, ?, ?, ?)",
            [-2000, "Electronics", 1, "2024-05-18", 1, "outflow"],
        )

        await database.runAsync(
            `INSERT INTO transactions_recurring (id, value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, account_id, flow, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [1, -500, "Subscription", 1, "2024-01-10T00:00", "FREQ=MONTHLY", null, 1, 0, null, "outflow", null],
        )

        await database.runAsync(
            "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, flow) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [-500, "Subscription", 1, "2024-05-10", 1, 1, "outflow"],
        )

        await database.runAsync(
            `INSERT INTO transactions_recurring (id, value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, account_id, flow, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [2, -1000, "Laptop", 1, "2024-03-01T00:00", "FREQ=MONTHLY;COUNT=4", null, 1, 1, null, "outflow", null],
        )

        await database.runAsync(
            "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, flow) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [-1000, "Laptop", 1, "2024-03-01", 2, 1, "outflow"],
        )
        await database.runAsync(
            "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, flow) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [-1000, "Laptop", 1, "2024-04-01", 2, 1, "outflow"],
        )

        const referenceDate = new Date("2024-05-15T00:00:00")
        const summary = await getCardStatementForDate(database, 1, referenceDate)

        assert(summary)
        assert.equal(summary?.cycleStart, "2024-04-21")
        assert.equal(summary?.cycleEnd, "2024-05-20")
        assert.equal(summary?.dueDate, "2024-06-10")
        assert.equal(summary?.realizedTotal, 3500)
        assert.equal(summary?.projectedInstallmentTotal, 1000)
        assert.equal(summary?.projectedRecurringTotal, 0)
        assert.equal(summary?.availableCredit, 55000)
        assert.equal(summary?.transactionsCount, 3)

        const history = await getCardStatementHistory(database, 1, { months: 2, referenceDate })
        assert.equal(history.length, 2)
        assert.equal(history[0].cycleEnd, "2024-05-20")
        assert.equal(history[1].cycleEnd, "2024-04-20")

        const juneSummary = await getCardStatementForDate(database, 1, new Date("2024-06-15T00:00:00"))
        assert.equal(juneSummary?.cycleStart, "2024-05-21")
        assert.equal(juneSummary?.cycleEnd, "2024-06-20")
    })

    it("adjusts due dates on weekends and updates cards", async () => {
        await database.runAsync(
            "INSERT INTO cards (id, name, color, \"limit\", limit_used, closing_day, due_day, ignore_weekends) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [1, "Primary", 2, 100000, 50000, 20, 10, 1],
        )

        const initialRow = await database.getFirstAsync<{ updated_at: string }>(
            "SELECT updated_at FROM cards WHERE id = ?",
            [1],
        )

        await new Promise((resolve) => setTimeout(resolve, 1100))

        await updateCardRecord(database, 1, { limit: 120000, limitUsed: 20000, ignoreWeekends: false, dueDay: 7 })

        const updatedRow = await database.getFirstAsync<{
            limit_value: number
            limit_used: number
            ignore_weekends: number
            due_day: number
            updated_at: string
        }>(
            "SELECT \"limit\" as limit_value, limit_used, ignore_weekends, due_day, updated_at FROM cards WHERE id = ?",
            [1],
        )

        assert.equal(updatedRow?.limit_value, 120000)
        assert.equal(updatedRow?.limit_used, 20000)
        assert.equal(updatedRow?.ignore_weekends, 0)
        assert.equal(updatedRow?.due_day, 7)
        assert.notEqual(updatedRow?.updated_at, initialRow?.updated_at)

        const cycle = resolveCycleBoundaries(new Date("2024-06-15T00:00:00"), 20)
        const dueDate = computeDueDate(cycle.end, 7, true)
        assert.equal(dueDate.toISOString().slice(0, 10), "2024-07-08")
    })
})
