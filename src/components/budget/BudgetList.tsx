import { useCallback } from "react"
import { FlatList, Text, View } from "react-native"
import { useTranslation } from "react-i18next"

import BudgetListItem from "./BudgetListItem"

import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { BudgetMonthlyPerformance } from "@/types/transaction"

type BudgetListProps = {
    data: BudgetMonthlyPerformance[]
    formatCurrency: (valueInCents: number) => string
    formatMonth: (monthKey: string) => string
    loading?: boolean
}

export default function BudgetList({ data, formatCurrency, formatMonth, loading }: BudgetListProps) {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()

    const renderItem = useCallback(
        ({ item }: { item: BudgetMonthlyPerformance }) => (
            <BudgetListItem
                performance={item}
                formatCurrency={formatCurrency}
                formatMonth={formatMonth}
            />
        ),
        [formatCurrency, formatMonth]
    )

    if (loading) {
        return (
            <View
                style={{
                    gap: 16,
                    padding: layout.margin.contentArea,
                    borderRadius: layout.radius.groupedView,
                    backgroundColor: theme.background.elevated.bg,
                }}
            >
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                    {t("loading", { defaultValue: "Loading..." })}
                </Text>
            </View>
        )
    }

    return (
        <View
            style={{
                gap: 16,
                padding: layout.margin.contentArea,
                borderRadius: layout.radius.groupedView,
                backgroundColor: theme.background.elevated.bg,
            }}
        >
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.monthKey}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 16 }}
            />
        </View>
    )
}
