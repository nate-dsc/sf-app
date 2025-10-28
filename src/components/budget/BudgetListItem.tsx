import { useMemo } from "react"
import { Text, View } from "react-native"
import { useTranslation } from "react-i18next"

import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { BudgetMonthlyPerformance } from "@/types/transaction"

type BudgetListItemProps = {
    performance: BudgetMonthlyPerformance
    formatCurrency: (valueInCents: number) => string
    formatMonth: (monthKey: string) => string
}

export default function BudgetListItem({
    performance,
    formatCurrency,
    formatMonth,
}: BudgetListItemProps) {
    const { theme } = useStyle()
    const { t } = useTranslation()

    const monthLabel = useMemo(
        () => formatMonth(performance.monthKey),
        [formatMonth, performance.monthKey]
    )

    const difference = performance.differenceCents
    const isUnderBudget = difference > 0
    const isOverBudget = difference < 0

    const differenceColor = isUnderBudget
        ? theme.colors.green
        : isOverBudget
            ? theme.colors.red
            : theme.text.secondaryLabel

    const ratio = useMemo(() => {
        if (performance.budgetCents > 0) {
            return Math.min(Math.abs(difference) / performance.budgetCents, 1)
        }

        return Math.abs(difference) > 0 ? 1 : 0
    }, [difference, performance.budgetCents])

    const differenceLabel = useMemo(() => {
        if (isUnderBudget) {
            return t("budget.monthlyPerformance.under", {
                defaultValue: "{{amount}} under budget",
                amount: formatCurrency(Math.abs(difference)),
            })
        }

        if (isOverBudget) {
            return t("budget.monthlyPerformance.over", {
                defaultValue: "{{amount}} over budget",
                amount: formatCurrency(Math.abs(difference)),
            })
        }

        return t("budget.monthlyPerformance.onTrack", { defaultValue: "On budget" })
    }, [difference, formatCurrency, isOverBudget, isUnderBudget, t])

    return (
        <View style={{ gap: 8 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text style={[FontStyles.body, { color: theme.text.label }]}>{monthLabel}</Text>
                <Text
                    style={[
                        FontStyles.footnote,
                        { color: differenceColor, textAlign: "right" },
                    ]}
                >
                    {differenceLabel}
                </Text>
            </View>

            <View
                style={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: theme.fill.secondary,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        height: "100%",
                        width: `${ratio * 100}%`,
                        backgroundColor: isUnderBudget
                            ? theme.colors.green
                            : isOverBudget
                                ? theme.colors.red
                                : theme.colors.gray3,
                    }}
                />
            </View>

            <Text style={[FontStyles.footnote, { color: theme.text.secondaryLabel }]}>
                {t("budget.monthlyPerformance.budgetVsSpent", {
                    defaultValue: "Budget {{budget}} · Spent {{spent}}",
                    budget: formatCurrency(performance.budgetCents),
                    spent: formatCurrency(performance.spentCents),
                })}
            </Text>
        </View>
    )
}
