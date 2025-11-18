import { AppIcon } from "@/components/AppIcon"
import BlurredModalView from "@/components/BlurredModalView"
import LabeledButton from "@/components/buttons/LabeledButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import EmptyView from "@/components/EmptyView"
import MonthlyRecurringSummaryDisplay from "@/components/recurring-screens-items/MonthlySummaryDisplay"
import RecurringCategoryBreakdownChart from "@/components/recurring-screens-items/RecurringCategoryBreakdownChart"
import RecurringTransactionList from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionList"
import RecurringTransactionModal from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionModal"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { RecurringTransaction } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Modal, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ExpenseRecurringScreen() {
    const { getRecurringSummaryThisMonth } = useTransactionDatabase()
    const [loading, setLoading] = useState(true)
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
    const [totalRecurringExpenses, setTotalRecurringExpenses] = useState<number>(0)
    const [rTModalVisible, setRTModalVisible] = useState(false)
    const [selectedRT, setSelectedRT] = useState<RecurringTransaction | null>(null)
    const [chartModalVisible, setChartModalVisible] = useState(false)
    const [categoryTotals, setCategoryTotals] = useState<Record<number, number>>({})
    const headerHeight = useHeaderHeight()
    const insets = useSafeAreaInsets()
    const {theme, layout} = useStyle()
    const refreshKey = useSummaryStore((state) => state.refreshKey)
    const hasLoadedRef = useRef(false)
    const {t} = useTranslation()

    const loadData = useCallback(async (options?: { showLoading?: boolean }) => {
        const shouldShowLoading = options?.showLoading ?? !hasLoadedRef.current

        if (shouldShowLoading) {
            setLoading(true)
        }

        try {
            const { totalRecurring, recurringTransactions, categoryTotals } = await getRecurringSummaryThisMonth("out")
            setTotalRecurringExpenses(totalRecurring)
            setRecurringTransactions(recurringTransactions)
            setCategoryTotals(categoryTotals)
        } catch (err) {
            console.error("Erro ao carregar transações recorrentes:", err)
        } finally {
            hasLoadedRef.current = true

            if (shouldShowLoading) {
                setLoading(false)
            }
        }
    }, [getRecurringSummaryThisMonth])

    const handleItemPress = (item: RecurringTransaction) => {
        setSelectedRT(item)
        setRTModalVisible(true)
    }

    const handleRTModalClose = () => {
        setRTModalVisible(false)
        setSelectedRT(null)
    }

    const handleDeleteSuccess = useCallback(() => {
        void loadData({ showLoading: false })
    }, [loadData])

    const handleChartModalClose = () => {
        setChartModalVisible(false)
    }

    useEffect(() => {
        void loadData()
    }, [loadData, refreshKey])

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
        )
    }

    return (
        <View 
            style={{
                flex: 1,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: insets.bottom,
                gap: 16,
            }}
        >
            {totalRecurringExpenses != 0? (
                <View
                    style={{
                        flex: 1,
                        paddingTop: headerHeight + layout.margin.contentArea,
                        gap: 16
                    }}
                >

                    <MonthlyRecurringSummaryDisplay
                        monthlyTotal={totalRecurringExpenses}
                    />

                    <LabeledButton
                        label={t("recurring.expenses.showDistribution")}
                        onPress={() => setChartModalVisible(true)}
                        tinted={false}
                    />

                    <View style={{paddingHorizontal: 16}}>
                        <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                            {t("recurring.expenses.allTransactions")}
                        </Text>
                    </View>
                    
                    <RecurringTransactionList
                        data={recurringTransactions}
                        onItemPress={handleItemPress}
                    />

                </View>
            ) : (
                <EmptyView
                    icon={
                        <AppIcon
                            name={"arrow.trianglehead.counterclockwise"}
                            androidName={"loop"}
                            size={70}
                            tintColor={theme.colors.red}
                        />
                    }
                    title={t("recurring.expenses.empty.title")}
                    subtitle={t("recurring.expenses.empty.description")}
                />
            )}

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={rTModalVisible}
                onRequestClose={handleRTModalClose}
            >
                <RecurringTransactionModal
                    transaction={selectedRT}
                    onBackgroundPress={handleRTModalClose}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={chartModalVisible}
                onRequestClose={handleChartModalClose}
            >
                <BlurredModalView onBackgroundPress={handleChartModalClose}>
                    <RecurringCategoryBreakdownChart categoryTotals={categoryTotals} flowType="out" />
                    <PrimaryButton label={t("button.return")} onPress={handleChartModalClose}/>
                </BlurredModalView>
            </Modal>
        </View>
    )
}
