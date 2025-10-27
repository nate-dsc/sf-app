import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { TileStyles } from "./TileStyles"

export default function BudgetTile() {
    const { data, loading, error } = useSummaryStore()
    const { theme } = useStyle()
    const { t, i18n } = useTranslation()
    const tileStyles = TileStyles(theme)

    if (loading && !data) {
        return <ActivityIndicator size="large" />
    }

    if (error) {
        return <Text>{error}</Text>
    }

    const budgets = data?.budgets ?? []

    const { plannedLabel, spentLabel, percentLabel, progressBarWidth, spentOverLimit } = useMemo(() => {
        const plannedCents = budgets.reduce((total, budget) => total + (budget.amount ?? 0), 0)
        const spentCents = budgets.reduce((total, budget) => total + (budget.spent ?? 0), 0)

        const locale = i18n.language
        const currency = locale === "pt-BR" ? "BRL" : "USD"
        const toCurrency = (valueInCents: number) =>
            (valueInCents / 100).toLocaleString(locale, {
                style: "currency",
                currency,
                currencySign: "standard",
            })

        const planned = toCurrency(plannedCents)
        const spent = toCurrency(spentCents)

        const percentValue = plannedCents > 0 ? (spentCents / plannedCents) * 100 : 0
        const safePercent = Number.isFinite(percentValue) ? percentValue : 0
        const clampedForBar = Math.min(Math.max(safePercent, 0), 100)
        const percentText = `${Math.max(safePercent, 0).toFixed(safePercent >= 100 || safePercent === 0 ? 0 : 1)}%`

        return {
            plannedLabel: planned,
            spentLabel: spent,
            percentLabel: percentText,
            progressBarWidth: clampedForBar,
            spentOverLimit: plannedCents > 0 && spentCents > plannedCents,
        }
    }, [budgets, i18n.language])

    const hasBudgets = budgets.length > 0

    return (
        <View style={{ gap: 6 }}>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{t("tiles.budget")}</Text>
            </View>
            <View
                style={{
                    backgroundColor: theme.background.elevated.bg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 15,
                    gap: 12,
                }}
            >
                {!hasBudgets ? (
                    <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("budget.tile.noBudgets")}</Text>
                ) : (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("tiles.budgetPlanned")}</Text>
                            <Text style={[tileStyles.text, FontStyles.numBody]}>{plannedLabel}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("tiles.budgetSpent")}</Text>
                            <Text
                                style={[
                                    tileStyles.text,
                                    FontStyles.numBody,
                                    spentOverLimit ? { color: theme.colors.red } : null,
                                ]}
                            >
                                {spentLabel}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 6,
                                borderRadius: 6,
                                backgroundColor: theme.background.tertiaryBg,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    width: `${progressBarWidth}%`,
                                    height: "100%",
                                    backgroundColor: spentOverLimit ? theme.colors.red : theme.colors.yellow,
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("tiles.budgetProgress")}</Text>
                            <Text style={[tileStyles.text, FontStyles.numBody]}>{percentLabel}</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    )
}