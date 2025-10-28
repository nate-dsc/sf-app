import { AppIcon } from "@/components/AppIcon"
import BottomButton from "@/components/buttons/BottomButton"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { BudgetMonthlyPerformance } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BudgetDisplay } from "./components/BudgetDisplay"
import { BudgetList } from "./components/BudgetList"

export default function BudgetScreen() {
    const headerHeight = useHeaderHeight()
    const router = useRouter()
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const insets = useSafeAreaInsets()
    const { getBudgetMonthlyPerformance } = useTransactionDatabase()

    const storedBudget = useBudgetStore((state) => state.budget)

    const [monthlyPerformance, setMonthlyPerformance] = useState<BudgetMonthlyPerformance[]>([])
    const [loadingPerformance, setLoadingPerformance] = useState(false)

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
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        paddingTop: headerHeight + layout.margin.contentArea,
                        gap: 32,
                    }}
                >
                    <BudgetDisplay budget={storedBudget} />

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
                            <BudgetList data={monthlyPerformance} loading={loadingPerformance} />
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 16,
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
                            style={[
                                FontStyles.title2,
                                { color: theme.text.label, textAlign: "center" },
                            ]}
                        >
                            {t("budget.empty.title")}
                        </Text>
                        <Text
                            style={[
                                FontStyles.body,
                                { color: theme.text.secondaryLabel, textAlign: "center" },
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
