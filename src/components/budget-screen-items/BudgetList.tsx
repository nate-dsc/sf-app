import { useCallback, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, View } from "react-native"

import BudgetListItem from "./BudgetListItem"

import i18n from "@/i18n"
import { BudgetMonthlyPerformance } from "@/types/Transactions"

type BudgetListProps = {
    data: BudgetMonthlyPerformance[]
    loading?: boolean
}

export default function BudgetList({ data, loading }: BudgetListProps) {

    const locale = i18n.language
    const currency = locale === "pt-BR" ? "BRL" : "USD"
    const [height, setHeight] = useState(0)

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        [currency, locale]
    )

    const formatCurrency = useMemo(
        () => (valueInCents: number) => currencyFormatter.format(valueInCents / 100),
        [currencyFormatter]
    )

    const monthFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
            }),
        [locale]
    )

    const formatMonth = useMemo(
        () => (ymString: string) => {
            const [year, month] = ymString.split("-").map(Number)
            const date = new Date(year, month - 1) // meses começam em 0
            return monthFormatter.format(date)
        },
        [monthFormatter]
    )

    const renderItem = useCallback(
        ({ item }: { item: BudgetMonthlyPerformance }) => (
            <BudgetListItem
                performance={item}
                formatCurrency={formatCurrency}
                formatMonth={formatMonth}
            />
        ),
        [formatCurrency, monthFormatter]
    )

    if (loading) {
        return (
            <ActivityIndicator/>
        )
    }

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(event) => {
                const viewHeight = event.nativeEvent.layout.height;
                setHeight(viewHeight);
            }}
        >
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.monthKey}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: height * 0.05,
                    paddingBottom: 60,
                    gap: 16
                }}
            />
        </View>
    )
}
