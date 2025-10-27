import { useStyle } from "@/context/StyleContext"
import { DistributionCategory, useDistributionStore } from "@/stores/useDistributionStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"



type DistributionProps = {
    style?: ViewStyle
}

export default function DistributionTile({ style }: DistributionProps) {

    const { t, i18n } = useTranslation()
    const { theme } = useStyle()
    const { data, loading, error } = useDistributionStore()

    const locale = i18n.language || "pt-BR"
    const currency = locale === "pt-BR" ? "BRL" : "USD"

    const formatCurrency = (valueInCents: number) =>
        (valueInCents / 100).toLocaleString(locale, {
            style: "currency",
            currency,
            currencySign: "standard",
        })

    const renderSection = (title: string, total: number, entries: DistributionCategory[]) => {
        const items = entries.slice(0, 3)

        return (
            <View style={{ gap: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Text style={[FontStyles.subhead, { color: theme.text.label }]}>{title}</Text>
                    <Text style={[FontStyles.numCallout, { color: theme.text.label }]}>{formatCurrency(total)}</Text>
                </View>

                {items.length === 0 ? (
                    <Text style={{ color: theme.text.secondaryLabel }}>
                        {t("tiles.distributionEmpty", { defaultValue: "No data available this month." })}
                    </Text>
                ) : (
                    <View style={{ gap: 10 }}>
                        {items.map((entry) => {
                            const barPercentage = Math.min(Math.max(entry.percentage * 100, 6), 100)
                            const color = entry.color ?? theme.colors.blue

                            return (
                                <View key={`${entry.flow}-${entry.categoryId}`} style={{ gap: 6 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                            <View
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: color,
                                                }}
                                            />
                                            <Text style={{ color: theme.text.label }}>{entry.name}</Text>
                                        </View>
                                        <Text style={[FontStyles.caption1, { color: theme.text.secondaryLabel }]}>
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
                                                width: `${barPercentage}%`,
                                                backgroundColor: color,
                                                borderRadius: 3,
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )}
            </View>
        )
    }

    return (
        <View style={[{ gap: 6 }, style]}>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                    {t("tiles.distribution")}
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: theme.background.elevated.bg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 16,
                    gap: 16,
                }}
            >
                {loading && !data ? (
                    <ActivityIndicator color={theme.text.label} />
                ) : error ? (
                    <Text style={{ color: theme.colors.red }}>{error}</Text>
                ) : (
                    <View style={{ gap: 16 }}>
                        {renderSection(t("tiles.expenses"), data?.outflowTotal ?? 0, data?.outflow ?? [])}
                        <View style={{ height: 1, backgroundColor: theme.background.tertiaryBg }} />
                        {renderSection(t("tiles.income"), data?.inflowTotal ?? 0, data?.inflow ?? [])}
                    </View>
                )}
            </View>
        </View>
    )
}
