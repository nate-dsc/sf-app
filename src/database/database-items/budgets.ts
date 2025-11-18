import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"

import { useBudgetStore } from "@/stores/useBudgetStore"
import {
    BudgetMonthlyPerformance,
    BudgetPeriod,
    CategoryDistributionFilters,
    MonthlyCategoryAggregate,
    Summary,
    type Transaction,
} from "@/types/transaction"

export function useBudgetsModule(database: SQLiteDatabase) {
    const calculateBudgetSpent = useCallback(async (period: BudgetPeriod) => {
        const now = new Date()
        const end = new Date(now)
        end.setHours(0, 0, 0, 0)

        const start = new Date(end)

        if (period === "weekly") {
            start.setDate(start.getDate() - 6)
        } else if (period === "biweekly") {
            start.setDate(start.getDate() - 13)
        } else {
            start.setDate(1)
        }

        const startISO = start.toISOString().slice(0, 10)
        const endISO = end.toISOString().slice(0, 10)

        const result = await database.getFirstAsync<{ total: number | null }>(
            "SELECT SUM(value) as total FROM transactions WHERE type = 'out' AND date(date) BETWEEN ? AND ?",
            [startISO, endISO]
        )

        const rawTotal = result?.total ?? 0
        return Math.abs(rawTotal)
    }, [database])

    const getSummaryFromDB = useCallback(async (): Promise<Summary> => {
        const today = new Date()
        const year = today.getFullYear()
        const month = (today.getMonth() + 1).toString().padStart(2, '0')
        const currentMonthStr = `${year}-${month}`

        try {
            const inflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE type = 'in' AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            )

            const outflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE type = 'out' AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            )

            const lastTransactionResult = await database.getFirstAsync<Transaction>(
                "SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 1"
            )

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
                inflowCurrentMonth: inflowResult?.total ?? 0,
                outflowCurrentMonth: (outflowResult?.total ?? 0) * -1,
                lastTransaction: lastTransactionResult || null,
                budget: budgetSnapshot,
            }
        } catch (error) {
            console.error("Falha ao buscar dados do sumário:", error)
            throw error
        }
    }, [calculateBudgetSpent, database])

    const getMonthlyCategoryDistribution = useCallback(async (
        filters: CategoryDistributionFilters = {},
    ): Promise<MonthlyCategoryAggregate[]> => {
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
                categoryName: string
                type: string
                color: string | null
                totalValue: number | null
            }>(
                `SELECT
                    c.id AS categoryId,
                    c.name AS categoryName,
                    c.type AS type,
                    c.color AS color,
                    SUM(t.value) AS totalValue
                FROM transactions t
                INNER JOIN categories c ON c.id = t.category
                ${whereStatement}
                GROUP BY c.id, c.name, c.type, c.color`,
                params
            )

            return rows
                .map((row) => {
                    const rawTotal = typeof row.totalValue === "number" ? row.totalValue : Number(row.totalValue ?? 0)
                    const normalizedTotal = row.type === "out" ? Math.abs(rawTotal) : rawTotal
                    const safeTotal = Number.isFinite(normalizedTotal) ? normalizedTotal : 0

                    return {
                        categoryId: row.categoryId,
                        name: row.categoryName,
                        color: row.color ?? null,
                        type: row.type === "out" ? "out" : "in",
                        total: safeTotal,
                    } satisfies MonthlyCategoryAggregate
                })
                .filter((entry) => entry.total > 0)
        } catch (error) {
            console.error("Falha ao buscar distribuição mensal por categoria:", error)
            throw error
        }
    }, [database])

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

            if (period === "biweekly") {
                return Math.round((amountCents * 26) / 12)
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
