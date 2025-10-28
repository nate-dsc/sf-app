import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

import { useStyle } from "@/context/StyleContext"
import { BudgetMonthlyPerformance } from "@/types/transaction"

type BudgetListItemProps = {
    performance: BudgetMonthlyPerformance
    formatCurrency: (valueInCents: number) => string
    formatMonth: (monthKey: string) => string
}

export default function BudgetListItem({ performance, formatCurrency, formatMonth}: BudgetListItemProps) {
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

    const percentage = useMemo(() => {
        if (performance.budgetCents === 0) return 0;
        const diff = ((performance.spentCents - performance.budgetCents) / performance.budgetCents) * 100;
        // Limita o comprimento visual a ±100%
        return Math.max(-100, Math.min(100, diff));
    }, [performance.spentCents, performance.budgetCents]);

    const actualPercentage = useMemo(() => {
        if (performance.budgetCents === 0) return 0;
        const diff = ((performance.spentCents - performance.budgetCents) / performance.budgetCents) * 100;
        // Limita o comprimento visual a ±100%
        return Math.abs(diff);
    }, [performance.spentCents, performance.budgetCents]);

    const isAbove = percentage > 0;

    const differenceLabel = useMemo(() => {
        if (isUnderBudget) {
            return t("budget.monthlyPerformance.under", {
                defaultValue: "{{amount}} under budget",
                amount: `${Math.abs(actualPercentage).toLocaleString()}%`,
            })
        }

        if (isOverBudget) {
            return t("budget.monthlyPerformance.over", {
                defaultValue: "{{amount}} over budget",
                amount: `${Math.abs(actualPercentage).toLocaleString()}%`,
            })
        }

        return t("budget.monthlyPerformance.onTrack", { defaultValue: "On budget" })
    }, [difference, formatCurrency, isOverBudget, isUnderBudget, t])

    return (
        <View
            style={{
                gap: 8,
                backgroundColor: theme.background.elevated.bg,
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flex: 3,
                        justifyContent: "space-evenly",
                        alignItems: "flex-start"
                    }}
                >
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: 17,
                                color: theme.text.label
                            }}
                        >
                            {monthLabel}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            style={{
                                fontSize: 17,
                                color: theme.text.secondaryLabel
                            }}
                        >
                            {t("budget.monthlyPerformance.budgetVsSpent", {
                                defaultValue: "Spent {{spent}}",
                                spent: formatCurrency(performance.spentCents),
                            })}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flex: 2,
                        gap: 8
                    }}
                >
                    <Text
                        style={{
                            fontSize: 13,
                            color: differenceColor,
                            textAlign: "center"
                        }}
                    >
                        {differenceLabel}
                    </Text>

                
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <View
                            style={{
                                width: "49%",
                                justifyContent: "center",
                                alignItems: "flex-end",
                            }}
                            >
                            {!isAbove && (
                                <View
                                style={{
                                    width: `${Math.abs(percentage)}%`,
                                    height: 10,
                                    backgroundColor: theme.colors.green,
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10,
                                }}
                                />
                            )}
                            </View>

                            <View
                                style={{
                                    width: 1,
                                    height: 20,
                                    borderLeftWidth: 1,
                                    borderColor: "gray",
                                    borderStyle: "dashed",
                                }}
                            />

                            <View
                                style={{
                                    width: "49%",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                }}
                            >
                            {isAbove && (
                                <View
                                    style={{
                                        width: `${Math.abs(percentage)}%`,
                                        height: 10,
                                        backgroundColor: theme.colors.red,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                    }}
                                />
                            )}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

{/*
    
            <Text style={[FontStyles.footnote, { color: theme.text.secondaryLabel }]}>
                {t("budget.monthlyPerformance.budgetVsSpent", {
                    defaultValue: "Budget {{budget}} · Spent {{spent}}",
                    budget: formatCurrency(performance.budgetCents),
                    spent: formatCurrency(performance.spentCents),
                })}
            </Text>
    */}