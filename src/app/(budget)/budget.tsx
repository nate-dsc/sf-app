import { AppIcon } from "@/components/AppIcon"
import BottomButton from "@/components/buttons/BottomButton"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { BudgetMonthlyPerformance } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import BudgetList from "@/components/budget-screen-items/BudgetList"
import EmptyView from "@/components/EmptyView"

import BlurredListView from "@/components/BlurredListView"
import { BudgetDisplay as BudgetDisplay2 } from "@/components/budget"

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
                <View
                    style={{
                        flex: 1,
                        paddingTop: headerHeight + layout.margin.contentArea,
                        gap: 32,
                    }}
                >
                    
                    <BudgetDisplay2 budget={storedBudget} />

                    <BlurredListView
                        title={t("budget.monthlyPerformance.title", { defaultValue: "Monthly performance" })}
                    >
                        <BudgetList data={monthlyPerformance} loading={loadingPerformance} />
                    </BlurredListView>
                </View>
            ) : (
                <EmptyView
                    icon={
                        <AppIcon
                            name={"chart.pie.fill"}
                            androidName={"pie-chart"}
                            size={70}
                            tintColor={theme.colors.indigo}
                        />
                    }
                    title={t("budget.empty.title")}
                    subtitle={t("budget.empty.description")}
                />
                
            )}

            <BottomButton
                label={buttonLabel}
                color={storedBudget ? theme.colors.blue : theme.colors.green}
                onPress={() => router.push("/(budget)/budgetEdit")}
            />
        </View>
    )
}


{/* <View style={{ gap: 16 }}>
    <Text style={[FontStyles.title3, { color: theme.text.label }]}>
        {t("budget.monthlyPerformance.title", { defaultValue: "Monthly performance" })}
    </Text>

    <View>
        <BudgetList data={monthlyPerformance} loading={loadingPerformance} />
    </View>
</View> */}