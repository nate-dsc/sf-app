import { AppIcon } from "@/components/AppIcon"
import BottomButton from "@/components/buttons/BottomButton"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useMemo } from "react"
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

    const storedBudget = useBudgetStore((state) => state.budget)

    const formattedAmount = useMemo(() => {
        if (!storedBudget) {
            return null
        }

        const currency = i18n.language === "pt-BR" ? "BRL" : "USD"

        return new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(storedBudget.amountCents / 100)
    }, [i18n.language, storedBudget])

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
                            <Text style={[FontStyles.title2, { color: theme.text.label, textAlign: "center" }]}>{t("budget.form.heading")}</Text>
                            <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                                {t("budget.form.description")}
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
