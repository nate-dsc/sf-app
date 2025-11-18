import type { SQLiteDatabase } from "expo-sqlite"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useBudgetStore } from "@/stores/useBudgetStore"
import {
    BudgetMonthlyPerformance,
    BudgetPeriod,
    CategoryDistributionFilters,
    MonthlyCategoryAggregate,
    Summary,
    type Transaction,
} from "@/types/transaction"

type CategoryInfo = {
    color: string
    translationKey: string
}

const CATEGORY_DETAILS: Record<number, CategoryInfo> = {
    1: { color: "#0EA5E9", translationKey: "categories.expenses.home" },
    2: { color: "#FB7185", translationKey: "categories.expenses.eating" },
    3: { color: "#F97316", translationKey: "categories.expenses.groceries" },
    4: { color: "#10B981", translationKey: "categories.expenses.transport" },
    5: { color: "#8B5CF6", translationKey: "categories.expenses.services" },
    6: { color: "#F59E0B", translationKey: "categories.expenses.leisure" },
    7: { color: "#22D3EE", translationKey: "categories.expenses.education" },
    8: { color: "#EC4899", translationKey: "categories.expenses.shopping" },
    9: { color: "#22C55E", translationKey: "categories.expenses.investment" },
    10: { color: "#EF4444", translationKey: "categories.expenses.health" },
    11: { color: "#FACC15", translationKey: "categories.expenses.emergency" },
    12: { color: "#38BDF8", translationKey: "categories.expenses.traveling" },
    13: { color: "#D946EF", translationKey: "categories.expenses.pet" },
    14: { color: "#4ADE80", translationKey: "categories.expenses.gaming" },
    15: { color: "#FB923C", translationKey: "categories.expenses.gambling" },
    16: { color: "#94A3B8", translationKey: "categories.expenses.other" },
    21: { color: "#22C55E", translationKey: "categories.income.salary" },
    22: { color: "#14B8A6", translationKey: "categories.income.freelance" },
    23: { color: "#6366F1", translationKey: "categories.income.oncall" },
    24: { color: "#E879F9", translationKey: "categories.income.overtime" },
    25: { color: "#F97316", translationKey: "categories.income.perdiem" },
    26: { color: "#0EA5E9", translationKey: "categories.income.sales" },
    27: { color: "#FBBF24", translationKey: "categories.income.roi" },
    28: { color: "#A855F7", translationKey: "categories.income.gambling" },
    29: { color: "#94A3B8", translationKey: "categories.income.other" },
}

export function useBudgetsModule(database: SQLiteDatabase) {
    const { t } = useTranslation()

    const getCategoryInfo = useCallback(
        (categoryId: number, type: "in" | "out"): { name: string; color: string | null } => {
            const details = CATEGORY_DETAILS[categoryId]

            if (!details) {
                const fallbackKey = type === "out" ? "categories.expenses.other" : "categories.income.other"
                return { name: t(fallbackKey), color: null }
            }

            return { name: t(details.translationKey), color: details.color }
        },
        [t],
    )

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
                        color: categoryInfo.color,
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
