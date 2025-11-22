import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { type TransactionType } from "@/types/Transactions"
import { findCategoryByID } from "@/utils/CategoryUtils"
import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"
import { PieChart } from "react-native-gifted-charts"

type RecurringCategoryBreakdownChartProps = {
    categoryTotals: Record<number, number>
    flowType: TransactionType
}

type ChartEntry = {
    categoryId: number
    label: string
    value: number
    formattedValue: string
    percentage: number
    color: string
}

type PieSegment = {
    value: number
    color: string
}

export default function RecurringCategoryBreakdownChart({ categoryTotals, flowType }: RecurringCategoryBreakdownChartProps) {
    const { theme } = useStyle()
    const { t, i18n } = useTranslation()

    const locale = i18n.language || "pt-BR"
    const chartTitle = flowType === "in"
        ? t("recurring.categoryBreakdown.incomeTitle")
        : t("recurring.categoryBreakdown.expenseTitle")

    const palette = useMemo(() => {
        const { colors } = theme

        return [
            colors.blue,
            colors.purple,
            colors.green,
            colors.orange,
            colors.cyan,
            colors.indigo,
            colors.pink,
            colors.mint,
            colors.teal,
            colors.yellow,
        ]
    }, [theme])

    const { pieSegments, legendEntries, totalValue } = useMemo(() => {
        const entries = Object.entries(categoryTotals ?? {})
            .map(([categoryId, total]) => ({
                categoryId: Number(categoryId),
                total: typeof total === "number" ? total : 0,
                magnitude: Math.abs(typeof total === "number" ? total : 0),
            }))
            .filter(({ magnitude }) => magnitude > 0)

        if (entries.length === 0) {
            return {
                pieSegments: [] as PieSegment[],
                legendEntries: [] as ChartEntry[],
                totalValue: 0,
            }
        }

        const sortedByMagnitude = entries.sort((a, b) => b.magnitude - a.magnitude)

        const topThree = sortedByMagnitude.slice(0, 3)
        const others = sortedByMagnitude.slice(3)

        const othersMagnitude = others.reduce((sum, entry) => sum + entry.magnitude, 0)

        const normalizedEntries = [...topThree]

        if (othersMagnitude > 0) {
            normalizedEntries.push({
                categoryId: -1,
                total: flowType === "out" ? -othersMagnitude : othersMagnitude,
                magnitude: othersMagnitude,
            })
        }

        const displayEntries = normalizedEntries.map((entry, index) => {
            const value = entry.magnitude / 100
            const color = palette[index % palette.length]

            const label = entry.categoryId === -1
                ? (flowType === "in"
                    ? t("recurring.categoryBreakdown.othersIncome")
                    : t("recurring.categoryBreakdown.othersExpense"))
                : t(findCategoryByID(entry.categoryId, flowType).translationKey)

            return {
                categoryId: entry.categoryId,
                label,
                value,
                formattedValue: value.toLocaleString(locale, { style: "currency", currency: "BRL", currencySign: "standard" }),
                percentage: 0,
                color,
            }
        })

        const totalValue = displayEntries.reduce((sum, entry) => sum + entry.value, 0)

        const legendEntries = displayEntries.map((entry) => ({
            ...entry,
            percentage: totalValue > 0 ? Math.round((entry.value / totalValue) * 1000) / 10 : 0,
        }))

        const pieSegments = displayEntries.map((entry) => ({
            value: entry.value,
            color: entry.color,
        }))

        return { pieSegments, legendEntries, totalValue }
    }, [categoryTotals, flowType, locale, palette, t])

    const centerLabel = useMemo(() => {
        const totalLabel = t("recurring.categoryBreakdown.totalLabel")

        const totalValueLabel = totalValue.toLocaleString(locale, { style: "currency", currency: "BRL", currencySign: "standard" })

        return (
            <View style={{ alignItems: "center" }}>
                <Text style={[FontStyles.caption2, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                    {totalLabel}
                </Text>
                <Text style={[FontStyles.numSubhead, { color: theme.text.label, textAlign: "center" }]}>
                    {totalValueLabel}
                </Text>
            </View>
        )
    }, [flowType, locale, t, theme.text.label, theme.text.secondaryLabel, totalValue])

    if (totalValue <= 0 || pieSegments.length === 0) {
        return (
            <View>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{chartTitle}</Text>
                <Text style={{ color: theme.text.secondaryLabel }}>
                    {t("recurring.categoryBreakdown.noData")}
                </Text>
            </View>
        )
    }

    return (
        <View>
            <Text style={[FontStyles.title3, { color: theme.text.label }]}>{chartTitle}</Text>
            <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <PieChart
                    data={pieSegments}
                    donut
                    innerRadius={50}
                    radius={70}
                    centerLabelComponent={() => centerLabel}
                    innerCircleColor={theme.background.group.secondaryBg}
                    sectionAutoFocus
                />
                <View style={{ flex: 1, gap: 12 }}>
                    {legendEntries.map((entry) => (
                        <View key={`${entry.categoryId}-${entry.label}`} style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                            <View
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 7,
                                    backgroundColor: entry.color,
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[FontStyles.subhead, { color: theme.text.label }]}>{entry.label}</Text>
                                <Text style={{ color: theme.text.secondaryLabel }}>
                                    {`${entry.formattedValue} • ${entry.percentage.toLocaleString(locale, {
                                        minimumFractionDigits: entry.percentage % 1 === 0 ? 0 : 1,
                                        maximumFractionDigits: 1,
                                    })}%`}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}
