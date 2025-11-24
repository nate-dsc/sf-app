import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { FONT_SIZE } from "@/styles/Fonts"
import { formatCurrency as formatCurrencyUtil } from "@/utils/currencyUtils"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import BaseView from "../BaseView"

export default function BudgetTile() {
    const { data, loading, error } = useSummaryStore()
    const { budgetTileMode } = useBudgetStore()
    const { theme } = useStyle()
    const { t, i18n } = useTranslation()

    const budget = data?.budget && data.budget.amountCents > 0 ? data.budget : null
    const locale = i18n.language
    const currency = locale === "pt-BR" ? "BRL" : "USD"

    const formatCurrency = useCallback(
        (valueInCents: number) =>
            formatCurrencyUtil(valueInCents, {
                locale,
                currency,
            }),
        [currency, locale],
    )

    const mode = budget
        ? budgetTileMode === "expensesVsBudget"
            ? "expensesVsBudget"
            : "balance"
        : "balance"

    const shouldShowBalance = !budget || mode === "balance"

    const inflowCents = data?.inflowCurrentMonth ?? 0
    const outflowCents = data?.outflowCurrentMonth ?? 0

    const { balanceLabel, inflowLabel, outflowLabel, balanceColor } = useMemo(() => {
        const balanceCents = inflowCents - outflowCents

        return {
            balanceLabel: formatCurrency(balanceCents),
            inflowLabel: formatCurrency(inflowCents),
            outflowLabel: formatCurrency(outflowCents),
            balanceColor:
                balanceCents > 0
                    ? theme.colors.green
                    : balanceCents < 0
                        ? theme.colors.red
                        : theme.text.label,
        }
    }, [formatCurrency, inflowCents, outflowCents, theme.colors.green, theme.colors.red, theme.text.label])

    const {
        plannedLabel,
        spentLabel,
        percentLabel,
        progressBarWidth,
        spentOverLimit,
        periodLabel,
    } = useMemo(() => {
        if (!budget) {
            return {
                plannedLabel: "-",
                spentLabel: "-",
                percentLabel: "0%",
                progressBarWidth: 0,
                spentOverLimit: false,
                periodLabel: "",
            }
        }

        const planned = formatCurrency(budget.amountCents)
        const spent = formatCurrency(budget.spentCents)

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
    }, [budget, formatCurrency, t])

    const tileHeaderLabelKey = useMemo(
        () => (shouldShowBalance ? "tiles.budgetEstimatedBalance" : "tiles.budgetExpensesVsBudget"),
        [shouldShowBalance],
    )

    if (loading && !data) {
        return <ActivityIndicator size="large" />
    }

    if (error) {
        return <Text>{error}</Text>
    }

    return (
        <View style={{ gap: 6 }}>
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{t(tileHeaderLabelKey)}</Text>
            </View>
            <BaseView
                style={{
                    gap: 12,
                }}
            >
                {shouldShowBalance ? (
                    <View style={{ gap: 16 }}>
                        <View style={{ gap: 4 }}>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.SUBHEAD,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("budget.tile.estimatedBalanceTitle")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.TITLE1,
                                    fontVariant: ["tabular-nums"],
                                    color: balanceColor
                                }}
                            >
                                {balanceLabel}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.FOOTNOTE,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("budget.tile.estimatedBalanceRemaining")}
                            </Text>
                        </View>
                        <View style={{ gap: 8 }}>
                            <View
                                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                            >
                                <Text
                                    style={{
                                        fontSize: FONT_SIZE.BODY,
                                        color: theme.text.secondaryLabel
                                    }}
                                >
                                    {t("budget.tile.estimatedBalanceInflow")}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FONT_SIZE.BODY,
                                        fontVariant: ["tabular-nums"],
                                        color: balanceColor
                                    }}
                                >
                                    {inflowLabel}
                                </Text>
                            </View>
                            <View
                                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                            >
                                <Text
                                    style={{
                                        fontSize: FONT_SIZE.BODY,
                                        color: theme.text.secondaryLabel
                                    }}
                                >
                                    {t("budget.tile.estimatedBalanceOutflow")}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FONT_SIZE.BODY,
                                        fontVariant: ["tabular-nums"],
                                        color: balanceColor
                                    }}
                                >
                                    {outflowLabel}
                                </Text>
                            </View>
                        </View>
                        {!budget ? (
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.FOOTNOTE,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("budget.tile.noBudget")}
                            </Text>
                        ) : null}
                    </View>
                ) : (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("budget.tile.periodLabel")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    color: theme.text.label
                                }}
                            >
                                {periodLabel}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("tiles.budgetPlanned")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    fontVariant: ["tabular-nums"],
                                    color: theme.text.label
                                }}
                            >
                                {plannedLabel}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("tiles.budgetSpent")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    fontVariant: ["tabular-nums"],
                                    color: spentOverLimit ? theme.colors.red : theme.text.label
                                }}
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
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {t("tiles.budgetProgress")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FONT_SIZE.BODY,
                                    fontVariant: ["tabular-nums"],
                                    color: theme.text.label
                                }}
                            >
                                {percentLabel}
                            </Text>
                        </View>
                    </>
                )}
            </BaseView>
        </View>
    )
}