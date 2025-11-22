import { AppIcon } from "@/components/AppIcon"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { DistributionCategory, useDistributionStore } from "@/stores/useDistributionStore"
import { type TransactionType } from "@/types/Transactions"
import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { PieChart } from "react-native-gifted-charts"

type DistributionBreakdownChartProps = {
    type: TransactionType
    entries: DistributionCategory[]
    title: string
    totalLabel: string
    emptyMessage: string
    othersLabel: string
    formatCurrency: (valueInCents: number) => string
    formatLegendDescription: (valueLabel: string, percentageLabel: string) => string
    locale: string
}

type DistributionCategoryListProps = {
    entries: DistributionCategory[]
    title: string
    emptyMessage: string
    formatCurrency: (valueInCents: number) => string
    formatPercentageLabel: (percentage: number) => string
}

type SummaryCardProps = {
    label: string
    valueInCents: number
    valueColor?: string
    formatCurrency: (valueInCents: number) => string
}

function SummaryCard({ label, valueInCents, valueColor, formatCurrency }: SummaryCardProps) {
    const { theme } = useStyle()

    return (
        <View
            style={{
                flex: 1,
                minWidth: 140,
                backgroundColor: theme.background.group.secondaryBg,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                padding: 16,
                gap: 6,
            }}
        >
            <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>{label}</Text>
            <Text style={[FontStyles.numTitle3, { color: valueColor ?? theme.text.label }]}>
                {formatCurrency(valueInCents)}
            </Text>
        </View>
    )
}

function DistributionBreakdownChart({
    type,
    entries,
    title,
    totalLabel,
    emptyMessage,
    othersLabel,
    formatCurrency,
    formatLegendDescription,
    locale,
}: DistributionBreakdownChartProps) {
    const { theme } = useStyle()

    const palette = useMemo(() => {
        const { colors } = theme

        return [
            colors.purple,
            colors.blue,
            colors.green,
            colors.orange,
            colors.indigo,
            colors.pink,
            colors.cyan,
            colors.mint,
            colors.teal,
            colors.yellow,
        ]
    }, [theme])

    const { segments, legendEntries, totalAmountInCents } = useMemo(() => {
        if (!entries || entries.length === 0) {
            return { segments: [], legendEntries: [], totalAmountInCents: 0 }
        }

        const sorted = [...entries].sort((a, b) => b.value - a.value)
        const total = sorted.reduce((sum, entry) => sum + entry.value, 0)

        const baseLegend = sorted.slice(0, 4).map((entry, index) => {
            const color = entry.color ?? palette[index % palette.length]
            const percentageValue = total > 0 ? (entry.value / total) * 100 : 0
            const roundedPercentage = Math.round(percentageValue * 10) / 10
            const percentageLabel = roundedPercentage.toLocaleString(locale, {
                minimumFractionDigits: roundedPercentage % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 1,
            })

            return {
                id: entry.categoryId,
                label: entry.name,
                color,
                value: entry.value / 100,
                formattedValue: formatCurrency(entry.value),
                percentage: roundedPercentage,
                percentageLabel,
            }
        })

        const others = sorted.slice(4)
        const othersTotal = others.reduce((sum, entry) => sum + entry.value, 0)

        const legend = [...baseLegend]

        if (othersTotal > 0) {
            const percentageValue = total > 0 ? (othersTotal / total) * 100 : 0
            const roundedPercentage = Math.round(percentageValue * 10) / 10
            const percentageLabel = roundedPercentage.toLocaleString(locale, {
                minimumFractionDigits: roundedPercentage % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 1,
            })

            legend.push({
                id: -1,
                label: othersLabel,
                color: palette[legend.length % palette.length],
                value: othersTotal / 100,
                formattedValue: formatCurrency(othersTotal),
                percentage: roundedPercentage,
                percentageLabel,
            })
        }

        const segments = legend.map((entry) => ({ value: entry.value, color: entry.color }))

        return { segments, legendEntries: legend, totalAmountInCents: total }
    }, [entries, formatCurrency, locale, othersLabel, palette])

    const centerLabel = useMemo(() => (
        <View style={{ alignItems: "center" }}>
            <Text style={[FontStyles.caption2, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                {totalLabel}
            </Text>
            <Text style={[FontStyles.numSubhead, { color: theme.text.label, textAlign: "center" }]}>
                {formatCurrency(totalAmountInCents)}
            </Text>
        </View>
    ), [formatCurrency, theme.text.label, theme.text.secondaryLabel, totalAmountInCents, totalLabel])

    if (totalAmountInCents <= 0 || segments.length === 0) {
        return (
            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 16,
                    gap: 8,
                }}
            >
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{title}</Text>
                <Text style={{ color: theme.text.secondaryLabel }}>{emptyMessage}</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                backgroundColor: theme.background.group.secondaryBg,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                borderRadius: 24,
                padding: 16,
                gap: 16,
            }}
        >
            <Text style={[FontStyles.title3, { color: theme.text.label }]}>{title}</Text>
            <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <PieChart
                    data={segments}
                    donut
                    innerRadius={52}
                    radius={76}
                    sectionAutoFocus
                    centerLabelComponent={() => centerLabel}
                />
                <View style={{ flex: 1, gap: 12 }}>
                    {legendEntries.map((entry) => {
                        const description = formatLegendDescription(entry.formattedValue, entry.percentageLabel)

                        return (
                            <View
                                key={`${type}-${entry.id}-${entry.label}`}
                                style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
                            >
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
                                    <Text style={{ color: theme.text.secondaryLabel }}>{description}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

function DistributionCategoryList({
    entries,
    title,
    emptyMessage,
    formatCurrency,
    formatPercentageLabel,
}: DistributionCategoryListProps) {
    const { theme } = useStyle()

    return (
        <View
            style={{
                backgroundColor: theme.background.group.secondaryBg,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                borderRadius: 24,
                padding: 16,
                gap: 16,
            }}
        >
            <Text style={[FontStyles.title3, { color: theme.text.label }]}>{title}</Text>

            {entries.length === 0 ? (
                <Text style={{ color: theme.text.secondaryLabel }}>{emptyMessage}</Text>
            ) : (
                <View style={{ gap: 14 }}>
                    {entries.map((entry) => {
                        const color = entry.color ?? theme.colors.blue
                        const percentageWidth = Math.min(Math.max(entry.percentage * 100, 4), 100)

                        return (
                            <View key={`${entry.type}-${entry.categoryId}`} style={{ gap: 8 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                                        <View
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: color,
                                            }}
                                        />
                                        <Text style={[FontStyles.subhead, { color: theme.text.label, flexShrink: 1 }]}>
                                            {entry.name}
                                        </Text>
                                    </View>
                                    <Text style={[FontStyles.numCallout, { color: theme.text.label }]}>
                                        {formatCurrency(entry.value)}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: theme.background.tertiaryBg,
                                        overflow: "hidden",
                                    }}
                                >
                                    <View
                                        style={{
                                            height: "100%",
                                            width: `${percentageWidth}%`,
                                            backgroundColor: color,
                                            borderRadius: 3,
                                        }}
                                    />
                                </View>
                                <Text style={{ color: theme.text.secondaryLabel }}>
                                    {formatPercentageLabel(entry.percentage * 100)}
                                </Text>
                            </View>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

export default function DistributionScreen() {
    const headerHeight = useHeaderHeight()
    const { theme } = useStyle()
    const { t, i18n } = useTranslation()
    const { getMonthlyCategoryDistribution } = useTransactionDatabase()

    const data = useDistributionStore((state) => state.data)
    const loading = useDistributionStore((state) => state.loading)
    const error = useDistributionStore((state) => state.error)
    const filters = useDistributionStore((state) => state.filters)
    const loadDistributionData = useDistributionStore((state) => state.loadData)

    const [selectedType, setSelectedType] = useState<TransactionType>("out")
    const [refreshing, setRefreshing] = useState(false)

    const locale = i18n.language || "pt-BR"
    const currency = locale === "pt-BR" ? "BRL" : "USD"

    const formatCurrency = useCallback(
        (valueInCents: number) =>
            (valueInCents / 100).toLocaleString(locale, {
                style: "currency",
                currency,
                currencySign: "standard",
            }),
        [currency, locale]
    )

    const formatLegendDescription = useCallback(
        (valueLabel: string, percentageLabel: string) =>
            t("distribution.list.itemDescription", {
                value: valueLabel,
                percentage: percentageLabel,
            }),
        [t]
    )

    const formatPercentageLabel = useCallback(
        (percentage: number) => {
            const rounded = Math.round(percentage * 10) / 10
            const percentageLabel = rounded.toLocaleString(locale, {
                minimumFractionDigits: rounded % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 1,
            })

            return t("distribution.list.percentage", { value: percentageLabel })
        },
        [locale, t]
    )

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)

        try {
            await loadDistributionData({
                getMonthlyCategoryDistribution,
                filters,
            })
        } finally {
            setRefreshing(false)
        }
    }, [filters, getMonthlyCategoryDistribution, loadDistributionData])

    useEffect(() => {
        if (!data && !loading) {
            void loadDistributionData({ getMonthlyCategoryDistribution, filters })
        }
    }, [data, filters, getMonthlyCategoryDistribution, loadDistributionData, loading])

    const changeMonth = useCallback(
        (delta: number) => {
            const currentMonth = filters.month ? new Date(filters.month) : new Date()
            const nextMonth = new Date(currentMonth)
            nextMonth.setDate(1)
            nextMonth.setMonth(currentMonth.getMonth() + delta)

            void loadDistributionData({
                getMonthlyCategoryDistribution,
                filters: { ...filters, month: nextMonth },
            })
        },
        [filters, getMonthlyCategoryDistribution, loadDistributionData]
    )

    const handleRetry = useCallback(() => {
        void loadDistributionData({ getMonthlyCategoryDistribution, filters })
    }, [filters, getMonthlyCategoryDistribution, loadDistributionData])

    const today = useMemo(() => {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), 1)
    }, [])

    const selectedMonth = filters.month ? new Date(filters.month) : new Date()
    selectedMonth.setDate(1)
    const isCurrentMonth =
        selectedMonth.getFullYear() === today.getFullYear() && selectedMonth.getMonth() === today.getMonth()

    const monthFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
            }),
        [locale]
    )

    const monthLabel = monthFormatter.format(selectedMonth)

    const inflowTotal = data?.inflowTotal ?? 0
    const outflowTotal = data?.outflowTotal ?? 0
    const netTotal = inflowTotal - outflowTotal

    const netColor = netTotal > 0 ? theme.colors.green : netTotal < 0 ? theme.colors.red : theme.text.label

    const hasAnyData = Boolean((data?.inflow?.length ?? 0) > 0 || (data?.outflow?.length ?? 0) > 0)

    const selectedEntries = selectedType === "out" ? data?.outflow ?? [] : data?.inflow ?? []

    const chartTitle = selectedType === "out" ? t("distribution.chart.outflowTitle") : t("distribution.chart.inflowTitle")
    const listTitle = selectedType === "out" ? t("distribution.list.outflowTitle") : t("distribution.list.inflowTitle")
    const listEmptyMessage = t("distribution.list.empty")
    const totalLabel = t("distribution.chart.totalLabel")
    const chartEmptyMessage = t("distribution.chart.empty")
    const othersLabel = t("distribution.chart.others")

    const flowOptions = useMemo(
        () => [
            { label: t("distribution.filters.outflow"), value: "out" as TransactionType },
            { label: t("distribution.filters.inflow"), value: "in" as TransactionType },
        ],
        [t]
    )

    const isInitialLoading = loading && !data

    const emptyState = (
        <View
            style={{
                backgroundColor: theme.background.group.secondaryBg,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                padding: 24,
                gap: 12,
                alignItems: "flex-start",
            }}
        >
            <Text style={[FontStyles.title3, { color: theme.text.label }]}>{t("distribution.empty.title")}</Text>
            <Text style={{ color: theme.text.secondaryLabel }}>{t("distribution.empty.description")}</Text>
        </View>
    )

    const errorState = (
        <View
            style={{
                backgroundColor: theme.background.group.secondaryBg,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                padding: 24,
                gap: 16,
            }}
        >
            <Text style={[FontStyles.title3, { color: theme.colors.red }]}>{t("distribution.error")}</Text>
            <TouchableOpacity
                onPress={handleRetry}
                style={{
                    alignSelf: "flex-start",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 999,
                    backgroundColor: theme.colors.purple,
                }}
            >
                <Text style={[FontStyles.subhead, { color: theme.colors.white }]}>{t("distribution.retry")}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.background.bg }}
            contentContainerStyle={{
                paddingTop: headerHeight + 24,
                paddingBottom: 48,
                paddingHorizontal: 24,
                gap: 24,
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={theme.text.label}
                    colors={[theme.colors.purple]}
                />
            }
        >
            <View style={{ gap: 20 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: theme.background.tertiaryBg,
                            backgroundColor: theme.background.group.secondaryBg,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={t("distribution.periodSelector.previous")}
                    >
                        <AppIcon
                            name="chevron.backward"
                            androidName="chevron-left"
                            size={18}
                            tintColor={theme.text.label}
                        />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={[FontStyles.caption1, { color: theme.text.secondaryLabel }]}>
                            {t("distribution.periodSelector.label")}
                        </Text>
                        <Text style={[FontStyles.title2, { color: theme.text.label, textTransform: "capitalize" }]}>
                            {monthLabel}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        disabled={isCurrentMonth}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: theme.background.tertiaryBg,
                            backgroundColor: theme.background.group.secondaryBg,
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: isCurrentMonth ? 0.5 : 1,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={t("distribution.periodSelector.next")}
                    >
                        <AppIcon
                            name="chevron.forward"
                            androidName="chevron-right"
                            size={18}
                            tintColor={theme.text.label}
                        />
                    </TouchableOpacity>
                </View>

                <SegmentedControlCompact options={flowOptions} selectedValue={selectedType} onChange={setSelectedType} />

                <View style={{ gap: 12 }}>
                    <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                        {t("distribution.summary.title")}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                        <SummaryCard
                            label={t("distribution.summary.outflow")}
                            valueInCents={outflowTotal}
                            valueColor={theme.colors.red}
                            formatCurrency={formatCurrency}
                        />
                        <SummaryCard
                            label={t("distribution.summary.inflow")}
                            valueInCents={inflowTotal}
                            valueColor={theme.colors.green}
                            formatCurrency={formatCurrency}
                        />
                        <SummaryCard
                            label={t("distribution.summary.net")}
                            valueInCents={netTotal}
                            valueColor={netColor}
                            formatCurrency={formatCurrency}
                        />
                    </View>
                </View>

                {isInitialLoading ? (
                    <View style={{ paddingVertical: 40, alignItems: "center" }}>
                        <ActivityIndicator size="large" color={theme.text.label} />
                    </View>
                ) : error ? (
                    errorState
                ) : hasAnyData ? (
                    <View style={{ gap: 24 }}>
                        <DistributionBreakdownChart
                            type={selectedType}
                            entries={selectedEntries}
                            title={chartTitle}
                            totalLabel={totalLabel}
                            emptyMessage={chartEmptyMessage}
                            othersLabel={othersLabel}
                            formatCurrency={formatCurrency}
                            formatLegendDescription={formatLegendDescription}
                            locale={locale}
                        />
                        <DistributionCategoryList
                            entries={selectedEntries}
                            title={listTitle}
                            emptyMessage={listEmptyMessage}
                            formatCurrency={formatCurrency}
                            formatPercentageLabel={formatPercentageLabel}
                        />
                    </View>
                ) : (
                    emptyState
                )}
            </View>
        </ScrollView>
    )
}
