import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"

import type { CustomTheme } from "@/types/theme"
import { CCard, CardStatementCycleSummary, CardStatementHistoryOptions, NewCard, UpdateCardInput } from "@/types/transaction"
import { getColorFromID } from "@/utils/CardUtils"

import { CCardDB, deleteCardRecord, fetchCard, fetchCards, insertCardRecord, updateCardLimitUsed, updateCardRecord } from "@/database/repositories/cardRepository"
import { fetchRecurringTransactionsForCard } from "../repositories/recurringTransactionRepository"
import {
    fetchCardCycleTotals,
    fetchRecurringOccurrencesDatesInCycle,
} from "../repositories/transactionRepository"

const ISO_DATE_LENGTH = 10

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

function computeDueDate(cycleEnd: Date, dueDay: number, ignoreWeekends: boolean) {
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

export function useCreditCardModule(database: SQLiteDatabase, theme: CustomTheme) {
    const mapCardRowToCard = useCallback((card: CCardDB): CCard => ({
        id: card.id,
        name: card.name,
        maxLimit: Number(card.max_limit ?? 0),
        limitUsed: Number(card.limit_used ?? 0),
        color: getColorFromID(typeof card.color === "number" ? card.color : 7, theme),
        closingDay: card.closing_day ?? 1,
        dueDay: card.due_day ?? 1,
        ignoreWeekends: !!(card.ignore_weekends ?? 0),
    }), [theme])

    const createCard = useCallback(async (data: NewCard) => {
        try {
            await insertCardRecord(database, data)
        } catch (error) {
            console.log("Não foi possivel adicionar o cartão")
            throw error
        }
    }, [database])

    const getCards = useCallback(async (): Promise<CCard[]> => {
        try {
            const cards = await fetchCards(database)
            return cards.map(mapCardRowToCard)
        } catch (error) {
            console.error("Could not fetch cards", error)
            throw error
        }
    }, [database, mapCardRowToCard])

    const getCard = useCallback(async (cardId: number): Promise<CCard | null> => {
        try {
            const card = await fetchCard(database, cardId)

            if (!card) {
                return null
            }

            return mapCardRowToCard(card)
        } catch (error) {
            console.error("Could not fetch card", error)
            throw error
        }
    }, [database, mapCardRowToCard])

    const updateCard = useCallback(async (cardId: number, updates: UpdateCardInput) => {
        try {
            await updateCardRecord(database, cardId, updates)
        } catch (error) {
            console.error("Could not update card", error)
            throw error
        }
    }, [database])

    const deleteCard = useCallback(async (id: number) => {
        try {
            await deleteCardRecord(database, id)
        } catch (error) {
            console.error("Could not delete card", error)
            throw error
        }
    }, [database])

    const mapCardStatement = useCallback((raw: RawCardStatementSummary): CardStatementCycleSummary => {
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

    return useMemo(() => ({
        createCard,
        getCards,
        getCard,
        updateCard,
        deleteCard,
        getCardStatementForDate,
        getCardStatementHistory,
        getCardsStatementSummaries,
        updateCardLimitUsed,
    }), [
        createCard,
        deleteCard,
        getCard,
        getCardStatementForDate,
        getCardStatementHistory,
        getCards,
        getCardsStatementSummaries,
        updateCard,
    ])
}
