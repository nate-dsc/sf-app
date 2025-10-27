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

    const budget = data?.budget ?? null

    const {
        plannedLabel,
        spentLabel,
        percentLabel,
        progressBarWidth,
        spentOverLimit,
        periodLabel,
    } = useMemo(() => {
        if (!budget || budget.amountCents <= 0) {
            return {
                plannedLabel: "-",
                spentLabel: "-",
                percentLabel: "0%",
                progressBarWidth: 0,
                spentOverLimit: false,
                periodLabel: "",
            }
        }

        const locale = i18n.language
        const currency = locale === "pt-BR" ? "BRL" : "USD"
        const toCurrency = (valueInCents: number) =>
            (valueInCents / 100).toLocaleString(locale, {
                style: "currency",
                currency,
                currencySign: "standard",
            })

        const planned = toCurrency(budget.amountCents)
        const spent = toCurrency(budget.spentCents)

        const percentValue = budget.amountCents > 0 ? (budget.spentCents / budget.amountCents) * 100 : 0
        const safePercent = Number.isFinite(percentValue) ? percentValue : 0
        const clampedForBar = Math.min(Math.max(safePercent, 0), 100)
        const percentText = `${Math.max(safePercent, 0).toFixed(safePercent >= 100 || safePercent === 0 ? 0 : 1)}%`

        return {
            plannedLabel: planned,
            spentLabel: spent,
            percentLabel: percentText,
            progressBarWidth: clampedForBar,
            spentOverLimit: budget.amountCents > 0 && budget.spentCents > budget.amountCents,
            periodLabel: t(`budget.periods.${budget.period}`),
        }
    }, [budget, i18n.language, t])

    const hasBudget = !!budget && budget.amountCents > 0

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
                {!hasBudget ? (
                    <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("budget.tile.noBudget")}</Text>
                ) : (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={[tileStyles.textUnfocused, FontStyles.body]}>{t("budget.tile.periodLabel")}</Text>
                            <Text style={[tileStyles.text, FontStyles.body]}>{periodLabel}</Text>
                        </View>
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