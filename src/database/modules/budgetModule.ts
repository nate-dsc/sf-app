import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { fetchLastTransaction, fetchTotalBetween } from "@/database/repositories/transactionRepository"
import { useBudgetStore } from "@/stores/useBudgetStore"
import {
    BudgetMonthlyPerformance,
    BudgetPeriod,
    CategoryDistributionFilters,
    MonthlyCategoryAggregate,
    Summary
} from "@/types/transaction"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { getMonthBoundaries } from "@/utils/DateUtils"

export function useBudgetsModule(database: SQLiteDatabase) {
    const { t } = useTranslation()

    const getCategoryInfo = useCallback(
        (categoryId: number, type: "in" | "out"): { name: string; color: string | null } => {
            const details = findCategoryByID(categoryId, type)

            return { name: t(details.translationKey), color: details.color }
        },
        [t],
    )

    const calculateBudgetSpent = useCallback(async function calculateBudgetSpent(period: BudgetPeriod) {

        const now = new Date()
        const referenceDate = new Date(now)
        referenceDate.setHours(0, 0, 0, 0)

        let start = new Date(referenceDate)
        let end = new Date(referenceDate)

        if (period === "weekly") {
            const dayOfWeek = referenceDate.getDay()
            start = new Date(referenceDate)
            start.setDate(referenceDate.getDate() - dayOfWeek)

            end = new Date(start)
            end.setDate(start.getDate() + 6)
        } else {
            start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
            start.setHours(0, 0, 0, 0)

            end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0)
            end.setHours(0, 0, 0, 0)
        }
        
        const startISO = start.toISOString()
        const endISO = end.toISOString()
        
        const result = await fetchTotalBetween(database, "out", startISO, endISO)
        const rawTotal = result?.total ?? 0

        return Math.abs(rawTotal)
    }, [database])

    const getSummaryFromDB = useCallback(async (): Promise<Summary> => {
        const {startISO, endISO} = getMonthBoundaries()

        try {
            const inResult = await fetchTotalBetween(database, "in", startISO, endISO)
            const outResult = await fetchTotalBetween(database, "out", startISO, endISO)
            const lastTransactionResult = await fetchLastTransaction(database)

            const budgetState = useBudgetStore.getState().budget

            let budgetSnapshot: Summary["budget"] = null

            if (budgetState) {
                const spentCents = await calculateBudgetSpent(budgetState.period)
                budgetSnapshot = {
                    period: budgetState.period,
                    amountCents: budgetState.amountCents,
                    spentCents,
                }
            }

            return {
                inflowCurrentMonth: inResult?.total ?? 0,
                outflowCurrentMonth: (outResult?.total ?? 0) * -1,
                lastTransaction: lastTransactionResult || null,
                budget: budgetSnapshot,
            }
        } catch (error) {
            console.error("Falha ao buscar dados do sumário:", error)
            throw error
        }
    }, [calculateBudgetSpent, database])

    const getMonthlyCategoryDistribution = useCallback(async (filters: CategoryDistributionFilters = {}): Promise<MonthlyCategoryAggregate[]> => {
        const targetDate = filters.month ? new Date(filters.month) : new Date()
        const year = targetDate.getFullYear()
        const month = (targetDate.getMonth() + 1).toString().padStart(2, "0")
        const monthKey = `${year}-${month}`

        const whereClauses = ["strftime('%Y-%m', t.date) = ?"]
        const params: (string | number)[] = [monthKey]

        if (filters.type) {
            whereClauses.push("c.type = ?")
            params.push(filters.type)
        }

        const whereStatement = `WHERE ${whereClauses.join(" AND ")}`

        try {
            const rows = await database.getAllAsync<{
                categoryId: number
                type: string
                totalValue: number | null
            }>(
                `SELECT
                    c.id AS categoryId,
                    c.type AS type,
                    SUM(t.value) AS totalValue
                FROM transactions t
                INNER JOIN categories c ON c.id = t.category
                ${whereStatement}
                GROUP BY c.id, c.type`,
                params
            )

            return rows
                .map((row) => {
                    const rawTotal = typeof row.totalValue === "number" ? row.totalValue : Number(row.totalValue ?? 0)
                    const normalizedTotal = row.type === "out" ? Math.abs(rawTotal) : rawTotal
                    const safeTotal = Number.isFinite(normalizedTotal) ? normalizedTotal : 0

                    const normalizedType = row.type === "out" ? "out" : "in"
                    const categoryInfo = getCategoryInfo(row.categoryId, normalizedType)

                    return {
                        categoryId: row.categoryId,
                        name: categoryInfo.name,
                        color: categoryInfo.color!,
                        type: normalizedType,
                        total: safeTotal,
                    } satisfies MonthlyCategoryAggregate
                })
                .filter((entry) => entry.total > 0)
        } catch (error) {
            console.error("Falha ao buscar distribuição mensal por categoria:", error)
            throw error
        }
    }, [database, getCategoryInfo])

    const getBudgetMonthlyPerformance = useCallback(async (options: { months?: number } = {}): Promise<BudgetMonthlyPerformance[]> => {
        const budgetState = useBudgetStore.getState().budget

        if (!budgetState) {
            return []
        }

        const monthsToFetch = Math.max(options.months ?? 6, 1)
        const monthKeys: string[] = []

        const referenceDate = new Date()
        referenceDate.setDate(1)
        referenceDate.setHours(0, 0, 0, 0)

        for (let index = 0; index < monthsToFetch; index += 1) {
            const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - index, 1)
            const year = target.getFullYear()
            const month = (target.getMonth() + 1).toString().padStart(2, "0")
            monthKeys.push(`${year}-${month}`)
        }

        type MonthlyTotalRow = { monthKey: string; totalValue: number | null }

        const placeholders = monthKeys.map(() => "?").join(", ")

        let totals: MonthlyTotalRow[] = []

        if (monthKeys.length > 0) {
            totals = await database.getAllAsync<MonthlyTotalRow>(
                `SELECT strftime('%Y-%m', date) as monthKey, SUM(value) as totalValue
                FROM transactions
                WHERE type = 'out' AND strftime('%Y-%m', date) IN (${placeholders})
                GROUP BY monthKey`,
                monthKeys
            )
        }

        const totalsMap = new Map<string, number>()

        totals.forEach((row) => {
            if (!row?.monthKey) {
                return
            }

            const rawTotal = typeof row.totalValue === "number" ? row.totalValue : Number(row.totalValue ?? 0)
            totalsMap.set(row.monthKey, Math.abs(rawTotal))
        })

        const convertBudgetToMonthly = (period: BudgetPeriod, amountCents: number) => {
            if (amountCents <= 0) {
                return 0
            }

            if (period === "monthly") {
                return amountCents
            }

            return Math.round((amountCents * 52) / 12)
        }

        const monthlyBudgetCents = convertBudgetToMonthly(budgetState.period, budgetState.amountCents)

        return monthKeys.map((monthKey) => {
            const spentCents = totalsMap.get(monthKey) ?? 0
            const differenceCents = monthlyBudgetCents - spentCents

            return {
                monthKey,
                budgetCents: monthlyBudgetCents,
                spentCents,
                differenceCents,
            }
        })
    }, [database])

    return useMemo(() => ({
        getSummaryFromDB,
        getMonthlyCategoryDistribution,
        getBudgetMonthlyPerformance,
    }), [
        getBudgetMonthlyPerformance,
        getMonthlyCategoryDistribution,
        getSummaryFromDB,
    ])
}
