import { AppIcon } from "@/components/AppIcon"
import BottomButton from "@/components/buttons/BottomButton"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { BudgetMonthlyPerformance } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const periodDefaults = {
    weekly: "Weekly",
    biweekly: "Every two weeks",
    monthly: "Monthly",
} as const

export default function BudgetScreen() {
    const headerHeight = useHeaderHeight()
    const router = useRouter()
    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()
    const insets = useSafeAreaInsets()
    const { getBudgetMonthlyPerformance } = useTransactionDatabase()

    const storedBudget = useBudgetStore((state) => state.budget)

    const [monthlyPerformance, setMonthlyPerformance] = useState<BudgetMonthlyPerformance[]>([])
    const [loadingPerformance, setLoadingPerformance] = useState(false)

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

    const formattedAmount = useMemo(() => {
        if (!storedBudget) {
            return null
        }

        return formatCurrency(storedBudget.amountCents)
    }, [formatCurrency, storedBudget])

    const periodLabel = useMemo(() => {
        if (!storedBudget) {
            return null
        }

        return t(`budget.periods.${storedBudget.period}`, {
            defaultValue: periodDefaults[storedBudget.period],
        })
    }, [storedBudget, t])

    const buttonLabel = storedBudget
        ? t("budget.form.editButton", { defaultValue: "Edit budget" })
        : t("budget.form.createButton", { defaultValue: "Create budget" })

    useEffect(() => {
        let isMounted = true

        if (!storedBudget) {
            setMonthlyPerformance([])
            setLoadingPerformance(false)
            return
        }

        setLoadingPerformance(true)

        const loadPerformance = async () => {
            try {
                const performance = await getBudgetMonthlyPerformance({ months: 6 })

                if (isMounted) {
                    setMonthlyPerformance(performance)
                }
            } catch (error) {
                console.error("Failed to load monthly budget performance", error)
                if (isMounted) {
                    setMonthlyPerformance([])
                }
            } finally {
                if (isMounted) {
                    setLoadingPerformance(false)
                }
            }
        }

        void loadPerformance()

        return () => {
            isMounted = false
        }
    }, [getBudgetMonthlyPerformance, storedBudget])

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: insets.bottom,
                gap: 16,
            }}
        >
            
                {storedBudget ? (
                    <ScrollView
                        style={{
                            flex: 1
                        }}
                        contentContainerStyle={{
                            paddingTop: headerHeight + layout.margin.contentArea,
                            gap: 32,
                        }}
                    >
                        <View
                            style={{
                                gap: 24,
                                padding: layout.margin.contentArea,
                                borderRadius: layout.radius.groupedView,
                                backgroundColor: theme.fill.secondary,
                            }}
                        >
                            <View style={{ gap: 4 }}>
                                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                                    {t("budget.form.amountLabel")}
                                </Text>
                                <Text style={[FontStyles.title1, { color: theme.text.label }]}>{formattedAmount}</Text>
                            </View>

                            <View style={{ gap: 4 }}>
                                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                                    {t("budget.form.frequency")}
                                </Text>
                                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{periodLabel}</Text>
                            </View>
                        </View>

                        <View style={{ gap: 16 }}>
                            <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                                {t("budget.monthlyPerformance.title", { defaultValue: "Monthly performance" })}
                            </Text>

                            <View
                                style={{
                                    gap: 16,
                                    padding: layout.margin.contentArea,
                                    borderRadius: layout.radius.groupedView,
                                    backgroundColor: theme.background.elevated.bg,
                                }}
                            >
                                {loadingPerformance ? (
                                    <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                                        {t("loading", { defaultValue: "Loading..." })}
                                    </Text>
                                ) : (
                                    monthlyPerformance.map((entry) => {
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
                                    })
                                )}
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 16
                        }}
                    >
                        <AppIcon
                            name={"chart.pie.fill"}
                            androidName={"pie-chart"}
                            size={70}
                            tintColor={theme.colors.indigo}
                        />

                        <View style={{ gap: 8 }}>
                            <Text
                                style={[FontStyles.title2,
                                    {color: theme.text.label,
                                    textAlign: "center"}
                                ]}
                            >
                                {t("budget.empty.title")}
                            </Text>
                            <Text 
                                style={[FontStyles.body,
                                    {color: theme.text.secondaryLabel,
                                    textAlign: "center"}
                                ]}
                            >
                                {t("budget.empty.description")}
                            </Text>
                        </View>
                    </View>
                )}

            <BottomButton
                label={buttonLabel}
                color={theme.colors.green}
                onPress={() => router.push("/(budget)/budgetEdit")}
            />
        </View>
    )
}
