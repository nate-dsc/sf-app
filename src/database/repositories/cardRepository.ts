import type { CardStatementHistoryOptions, UpdateCardInput } from "@/types/transaction"
import type { SQLiteDatabase } from "expo-sqlite"
import { RRule } from "rrule"

export type CardRow = {
    id: number
    name: string
    color: number | null
    max_limit: number | null
    limit_used: number | null
    closing_day: number | null
    due_day: number | null
    ignore_weekends: number | null
}

export type RawCardStatementSummary = {
    cardId: number
    cardName: string
    colorId: number | null
    closingDay: number
    dueDay: number
    ignoreWeekends: boolean
    cycleStart: string
    cycleEnd: string
    dueDate: string
    referenceMonth: string
    maxLimit: number
    limitUsed: number
    availableCredit: number
    realizedTotal: number
    projectedRecurringTotal: number
    projectedInstallmentTotal: number
    projectedTotal: number
    transactionsCount: number
}

const ISO_DATE_LENGTH = 10

function formatISODate(date: Date): string {
    return date.toISOString().slice(0, ISO_DATE_LENGTH)
}

function normalizeDateKey(value: string | null | undefined): string | null {
    if (!value) {
        return null
    }

    if (value.length >= ISO_DATE_LENGTH) {
        return value.slice(0, ISO_DATE_LENGTH)
    }

    return value
}

function daysInMonth(year: number, monthIndex: number) {
    return new Date(year, monthIndex + 1, 0).getDate()
}

export function resolveCycleBoundaries(reference: Date, closingDay: number) {
    const normalized = new Date(reference.getTime())
    normalized.setHours(0, 0, 0, 0)

    const refYear = normalized.getFullYear()
    const refMonth = normalized.getMonth()
    const closingInRefMonth = Math.min(closingDay, daysInMonth(refYear, refMonth))

    const cycleEnd = new Date(refYear, refMonth, closingInRefMonth, 23, 59, 59, 999)

    let cycleStart: Date

    if (normalized.getDate() > closingInRefMonth) {
        const nextMonthDate = new Date(refYear, refMonth + 1, 1)
        const closingInNextMonth = Math.min(closingDay, daysInMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth()))
        cycleStart = new Date(refYear, refMonth, closingInRefMonth + 1, 0, 0, 0, 0)
        cycleEnd.setFullYear(nextMonthDate.getFullYear())
        cycleEnd.setMonth(nextMonthDate.getMonth())
        cycleEnd.setDate(closingInNextMonth)
    } else {
        const previousMonthDate = new Date(refYear, refMonth - 1, 1)
        const closingInPreviousMonth = Math.min(
            closingDay,
            daysInMonth(previousMonthDate.getFullYear(), previousMonthDate.getMonth())
        )

        cycleStart = new Date(
            previousMonthDate.getFullYear(),
            previousMonthDate.getMonth(),
            closingInPreviousMonth + 1,
            0,
            0,
            0,
            0,
        )
    }

    cycleStart.setHours(0, 0, 0, 0)

    const cycleStartKey = formatISODate(cycleStart)
    const cycleEndKey = formatISODate(cycleEnd)

    return {
        start: cycleStart,
        end: cycleEnd,
        startKey: cycleStartKey,
        endKey: cycleEndKey,
        referenceMonth: cycleEndKey.slice(0, 7),
    }
}

export function computeDueDate(cycleEnd: Date, dueDay: number, ignoreWeekends: boolean) {
    const nextMonth = new Date(cycleEnd.getFullYear(), cycleEnd.getMonth() + 1, 1)
    const dueDayInMonth = Math.min(dueDay, daysInMonth(nextMonth.getFullYear(), nextMonth.getMonth()))
    const dueDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dueDayInMonth, 0, 0, 0, 0)

    if (!ignoreWeekends) {
        return dueDate
    }

    const day = dueDate.getDay()

    if (day === 0) {
        dueDate.setDate(dueDate.getDate() + 1)
    } else if (day === 6) {
        dueDate.setDate(dueDate.getDate() + 2)
    }

    return dueDate
}

async function fetchCard(database: SQLiteDatabase, cardId: number): Promise<CardRow | null> {
    const row = await database.getFirstAsync<CardRow>(
        "SELECT id, name, color, max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards WHERE id = ?",
        [cardId],
    )

    return row ?? null
}

async function computeProjectedTotals(
    database: SQLiteDatabase,
    cardId: number,
    cycleStartKey: string,
    cycleEndKey: string,
): Promise<{ projectedRecurring: number; projectedInstallments: number }> {
    type RecurringRow = {
        id: number
        value: number
        rrule: string
        date_start: string
        is_installment: number
    }

    const blueprints = await database.getAllAsync<RecurringRow>(
        "SELECT id, value, rrule, date_start, is_installment FROM transactions_recurring WHERE card_id = ?",
        [cardId],
    )

    if (blueprints.length === 0) {
        return { projectedRecurring: 0, projectedInstallments: 0 }
    }

    let projectedRecurring = 0
    let projectedInstallments = 0

    const cycleStartDate = new Date(`${cycleStartKey}T00:00:00Z`)
    const cycleEndDate = new Date(`${cycleEndKey}T23:59:59Z`)

    for (const blueprint of blueprints) {
        const options = RRule.parseString(blueprint.rrule)
        if (blueprint.date_start) {
            options.dtstart = new Date(`${blueprint.date_start}Z`)
        }

        const rule = new RRule(options)
        const occurrences = rule.between(cycleStartDate, cycleEndDate, true)

        if (occurrences.length === 0) {
            continue
        }

        const realizedRows = await database.getAllAsync<{ date: string }>(
            "SELECT date FROM transactions WHERE id_recurring = ? AND card_id = ? AND date(date) BETWEEN ? AND ?",
            [blueprint.id, cardId, cycleStartKey, cycleEndKey],
        )

        const realizedKeys = new Set(
            realizedRows
                .map((row) => normalizeDateKey(row.date))
                .filter((value): value is string => Boolean(value))
        )

        let pendingCount = 0

        for (const occurrence of occurrences) {
            const key = occurrence.toISOString().slice(0, ISO_DATE_LENGTH)
            if (!realizedKeys.has(key)) {
                pendingCount += 1
            }
        }

        if (pendingCount <= 0) {
            continue
        }

        const amount = Math.abs(blueprint.value)

        if (blueprint.is_installment) {
            projectedInstallments += amount * pendingCount
        } else {
            projectedRecurring += amount * pendingCount
        }
    }

    return { projectedRecurring, projectedInstallments }
}

function buildSummary(
    card: CardRow,
    cycle: ReturnType<typeof resolveCycleBoundaries>,
    dueDate: Date,
    realizedTotal: number,
    transactionsCount: number,
    projectedRecurring: number,
    projectedInstallments: number,
): RawCardStatementSummary {
    const limit = Number(card.max_limit ?? 0)
    const limitUsed = Number(card.limit_used ?? 0)
    const projectedTotal = projectedRecurring + projectedInstallments

    return {
        cardId: card.id,
        cardName: card.name,
        colorId: card.color ?? null,
        closingDay: card.closing_day ?? 1,
        dueDay: card.due_day ?? 1,
        ignoreWeekends: Boolean(card.ignore_weekends ?? 0),
        cycleStart: cycle.startKey,
        cycleEnd: cycle.endKey,
        dueDate: formatISODate(dueDate),
        referenceMonth: cycle.referenceMonth,
        maxLimit: limit,
        limitUsed,
        availableCredit: Math.max(limit - limitUsed, 0),
        realizedTotal,
        projectedRecurringTotal: projectedRecurring,
        projectedInstallmentTotal: projectedInstallments,
        projectedTotal,
        transactionsCount,
    }
}

export async function getCardStatementForDate(
    database: SQLiteDatabase,
    cardId: number,
    referenceDate: Date = new Date(),
): Promise<RawCardStatementSummary | null> {
    const card = await fetchCard(database, cardId)

    if (!card) {
        return null
    }

    const closingDay = card.closing_day ?? 1
    const dueDay = card.due_day ?? closingDay
    const ignoreWeekends = Boolean(card.ignore_weekends ?? 0)

    const cycle = resolveCycleBoundaries(referenceDate, closingDay)
    const dueDate = computeDueDate(cycle.end, dueDay, ignoreWeekends)

    const realizedRow = await database.getFirstAsync<{ total: number | null; count: number }>(
        `SELECT COALESCE(SUM(CASE WHEN value < 0 THEN -value ELSE value END), 0) as total, COUNT(*) as count
         FROM transactions
         WHERE card_id = ? AND date(date) BETWEEN ? AND ?`,
        [cardId, cycle.startKey, cycle.endKey],
    )

    const realizedTotal = Number(realizedRow?.total ?? 0)
    const transactionsCount = Number(realizedRow?.count ?? 0)

    const { projectedRecurring, projectedInstallments } = await computeProjectedTotals(
        database,
        cardId,
        cycle.startKey,
        cycle.endKey,
    )

    return buildSummary(card, cycle, dueDate, realizedTotal, transactionsCount, projectedRecurring, projectedInstallments)
}

export async function getCardsStatementForDate(
    database: SQLiteDatabase,
    referenceDate: Date = new Date(),
): Promise<RawCardStatementSummary[]> {
    const cards = await database.getAllAsync<CardRow>(
        "SELECT id, name, color, max_limit, limit_used, closing_day, due_day, ignore_weekends FROM cards",
    )

    const summaries: RawCardStatementSummary[] = []

    for (const card of cards) {
        const summary = await getCardStatementForDate(database, card.id, referenceDate)
        if (summary) {
            summaries.push(summary)
        }
    }

    return summaries.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export async function getCardStatementHistory(
    database: SQLiteDatabase,
    cardId: number,
    options: CardStatementHistoryOptions = {},
): Promise<RawCardStatementSummary[]> {
    const months = Math.max(options.months ?? 24, 1)
    const referenceDate = options.referenceDate ?? new Date()

    const results: RawCardStatementSummary[] = []
    let cursor = new Date(referenceDate.getTime())

    for (let index = 0; index < months; index += 1) {
        const summary = await getCardStatementForDate(database, cardId, cursor)
        if (!summary) {
            break
        }

        results.push(summary)

        const previousCycleDate = new Date(`${summary.cycleStart}T00:00:00Z`)
        previousCycleDate.setDate(previousCycleDate.getDate() - 1)
        cursor = previousCycleDate
    }

    return results
}

export async function updateCardRecord(database: SQLiteDatabase, cardId: number, input: UpdateCardInput) {
    const fields: string[] = []
    const values: any[] = []

    if (input.name !== undefined) {
        fields.push("name = ?")
        values.push(input.name)
    }

    if (input.color !== undefined) {
        fields.push("color = ?")
        values.push(input.color)
    }

    if (input.maxLimit !== undefined) {
        fields.push('max_limit = ?')
        values.push(input.maxLimit)
    }

    if (input.limitUsed !== undefined) {
        fields.push("limit_used = ?")
        values.push(input.limitUsed)
    }

    if (input.closingDay !== undefined) {
        fields.push("closing_day = ?")
        values.push(input.closingDay)
    }

    if (input.dueDay !== undefined) {
        fields.push("due_day = ?")
        values.push(input.dueDay)
    }

    if (input.ignoreWeekends !== undefined) {
        fields.push("ignore_weekends = ?")
        values.push(input.ignoreWeekends ? 1 : 0)
    }

    if (input.issuer !== undefined) {
        fields.push("issuer = ?")
        values.push(input.issuer)
    }

    if (input.lastFour !== undefined) {
        fields.push("last_four = ?")
        values.push(input.lastFour)
    }

    if (fields.length === 0) {
        return
    }

    fields.push("updated_at = datetime('now')")

    values.push(cardId)

    await database.runAsync(`UPDATE cards SET ${fields.join(", ")} WHERE id = ?`, values)
}

export async function deleteCardRecord(database: SQLiteDatabase, cardId: number) {
    await database.runAsync("DELETE FROM cards WHERE id = ?", [cardId])
}
