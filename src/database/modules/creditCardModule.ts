import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"

import { deleteCardDB, fetchCard, fetchCards, insertCard, updateCardDB, updateCardLimitUsed } from "@/database/repositories/CreditCardRepository"
import { CCard, CCardDB, NewCard, UpdateCardInput } from "@/types/CreditCards"

export function useCreditCardModule(database: SQLiteDatabase) {

    const createCard = useCallback(async function createCard(data: NewCard) {
        try {
            await insertCard(database, data)
        } catch (error) {
            console.log("[Credit Card Module] Could not insert new card into database")
            throw error
        }
    }, [database])

    const mapCCardDBToCCard = useCallback((card: CCardDB): CCard => ({
        id: card.id,
        name: card.name,
        maxLimit: card.max_limit,
        limitUsed: card.limit_used,
        color: card.color,
        closingDay: card.closing_day,
        dueDay: card.due_day,
        ignoreWeekends: card.ignore_weekends === 1,
    }), [])

    const getCard = useCallback(async (cardId: number): Promise<CCard | null> => {
        try {
            const card = await fetchCard(database, cardId)

            if (!card) {
                return null
            }

            return mapCCardDBToCCard(card)
        } catch (error) {
            console.error(`[Credit Card Module] Could not fetch card of id: ${cardId}`, error)
            throw error
        }
    }, [database, mapCCardDBToCCard])

    const getAllCards = useCallback(async (): Promise<CCard[]> => {
        try {
            const cards = await fetchCards(database)
            return cards.map(mapCCardDBToCCard)

        } catch (error) {
            console.error("[Credit Card Module] Could not fetch all cards", error)
            throw error
        }
    }, [database, mapCCardDBToCCard])

    const updateCard = useCallback(async (cardId: number, updates: UpdateCardInput) => {
        try {
            await updateCardDB(database, cardId, updates)
        } catch (error) {
            console.error(`[Credit Card Module] Could not update card of id: ${cardId}`, error)
            throw error
        }
    }, [database])

    const deleteCard = useCallback(async (id: number) => {
        try {
            await deleteCardDB(database, id)
        } catch (error) {
            console.error(`[Credit Card Module] Could not update card of id: ${id}`, error)
            throw error
        }
    }, [database])

    return useMemo(() => ({
        createCard,
        getCard,
        getAllCards,
        updateCard,
        deleteCard,
        updateCardLimitUsed,
    }), [
        createCard,
        getCard,
        getAllCards,
        updateCard,
        deleteCard,
    ])
}

/**
 * const ISO_DATE_LENGTH = 10

type RawCardStatementSummary = {
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

function resolveCycleBoundaries(reference: Date, closingDay: number) {
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
 * 
 * 
 * function computeDueDate(cycleEnd: Date, dueDay: number, ignoreWeekends: boolean) {
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

async function computeProjectedTotals(
    database: SQLiteDatabase,
    cardId: number,
    cycleStartKey: string,
    cycleEndKey: string,
): Promise<{ projectedRecurring: number; projectedInstallments: number }> {
    const blueprints = await fetchRecurringTransactionsForCard(database, cardId)

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

        const realizedRows = await fetchRecurringOccurrencesDatesInCycle(
            database,
            blueprint.id,
            cardId,
            cycleStartKey,
            cycleEndKey,
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
    card: CCardDB,
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
 * const mapCardStatement = useCallback((raw: RawCardStatementSummary): CardStatementCycleSummary => {
        const resolvedColorId = typeof raw.colorId === "number" ? raw.colorId : 7

        return {
            cardId: raw.cardId,
            cardName: raw.cardName,
            color: getColorFromID(resolvedColorId, theme),
            colorId: raw.colorId ?? null,
            closingDay: raw.closingDay,
            dueDay: raw.dueDay,
            cycleStart: raw.cycleStart,
            cycleEnd: raw.cycleEnd,
            dueDate: raw.dueDate,
            referenceMonth: raw.referenceMonth,
            maxLimit: raw.maxLimit,
            limitUsed: raw.limitUsed,
            availableCredit: raw.availableCredit,
            realizedTotal: raw.realizedTotal,
            projectedRecurringTotal: raw.projectedRecurringTotal,
            projectedInstallmentTotal: raw.projectedInstallmentTotal,
            projectedTotal: raw.projectedTotal,
            transactionsCount: raw.transactionsCount,
        }
    }, [theme])

    const getCardStatementForDate = useCallback(async (
        cardId: number,
        referenceDate: Date = new Date(),
    ): Promise<CardStatementCycleSummary | null> => {
        const card = await fetchCard(database, cardId)

        if (!card) {
            return null
        }

        const closingDay = card.closing_day ?? 1
        const dueDay = card.due_day ?? closingDay
        const ignoreWeekends = Boolean(card.ignore_weekends ?? 0)

        const cycle = resolveCycleBoundaries(referenceDate, closingDay)
        const dueDate = computeDueDate(cycle.end, dueDay, ignoreWeekends)

        const realizedRow = await fetchCardCycleTotals(database, cardId, cycle.startKey, cycle.endKey)

        const realizedTotal = Number(realizedRow.total ?? 0)
        const transactionsCount = Number(realizedRow.count ?? 0)

        const { projectedRecurring, projectedInstallments } = await computeProjectedTotals(
            database,
            cardId,
            cycle.startKey,
            cycle.endKey,
        )

        return mapCardStatement(
            buildSummary(card, cycle, dueDate, realizedTotal, transactionsCount, projectedRecurring, projectedInstallments)
        )
    }, [database, mapCardStatement])

    const getCardStatementHistory = useCallback(async (
        cardId: number,
        options: CardStatementHistoryOptions = {},
    ): Promise<CardStatementCycleSummary[]> => {
        const months = Math.max(options.months ?? 24, 1)
        const referenceDate = options.referenceDate ?? new Date()

        const results: CardStatementCycleSummary[] = []
        let cursor = new Date(referenceDate.getTime())

        for (let index = 0; index < months; index += 1) {
            const summary = await getCardStatementForDate(cardId, cursor)
            if (!summary) {
                break
            }

            results.push(summary)

            const previousCycleDate = new Date(`${summary.cycleStart}T00:00:00Z`)
            previousCycleDate.setDate(previousCycleDate.getDate() - 1)
            cursor = previousCycleDate
        }

        return results
    }, [getCardStatementForDate])

    const getCardsStatementSummaries = useCallback(async (
        referenceDate: Date = new Date(),
    ): Promise<CardStatementCycleSummary[]> => {
        const cards = await fetchCards(database)

        const summaries: CardStatementCycleSummary[] = []

        for (const card of cards) {
            const summary = await getCardStatementForDate(card.id, referenceDate)
            if (summary) {
                summaries.push(summary)
            }
        }

        return summaries.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    }, [database, getCardStatementForDate])
 */
