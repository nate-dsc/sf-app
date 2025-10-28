import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { BudgetMonthlyPerformance } from "@/types/transaction"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

type BudgetListProps = {
    data: BudgetMonthlyPerformance[]
    loading?: boolean
}

export function BudgetList({ data, loading = false }: BudgetListProps) {
    const { theme } = useStyle()
    const { t, i18n } = useTranslation()

    const locale = i18n.language
    const currency = locale === "pt-BR" ? "BRL" : "USD"

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

    if (loading) {
        return (
            <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                {t("loading", { defaultValue: "Loading..." })}
            </Text>
        )
    }

    if (!data.length) {
        return null
    }

    return (
        <View style={{ gap: 16 }}>
            {data.map((entry) => {
                const [year, month] = entry.monthKey.split("-").map((value) => Number(value))
                const monthLabel = Number.isFinite(year) && Number.isFinite(month)
                    ? monthFormatter.format(new Date(year, month - 1, 1))
                    : entry.monthKey

                const difference = entry.differenceCents
                const isUnderBudget = difference > 0
                const isOverBudget = difference < 0
                const differenceColor = isUnderBudget
                    ? theme.colors.green
                    : isOverBudget
                        ? theme.colors.red
                        : theme.text.secondaryLabel

                const ratio = entry.budgetCents > 0
                    ? Math.min(Math.abs(difference) / entry.budgetCents, 1)
                    : Math.abs(difference) > 0
                        ? 1
                        : 0

                const differenceLabel = isUnderBudget
                    ? t("budget.monthlyPerformance.under", {
                          defaultValue: "{{amount}} under budget",
                          amount: formatCurrency(Math.abs(difference)),
                      })
                    : isOverBudget
                        ? t("budget.monthlyPerformance.over", {
                              defaultValue: "{{amount}} over budget",
                              amount: formatCurrency(Math.abs(difference)),
                          })
                        : t("budget.monthlyPerformance.onTrack", { defaultValue: "On budget" })

                return (
                    <View key={entry.monthKey} style={{ gap: 8 }}>
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
                                budget: formatCurrency(entry.budgetCents),
                                spent: formatCurrency(entry.spentCents),
                            })}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

export default BudgetList
