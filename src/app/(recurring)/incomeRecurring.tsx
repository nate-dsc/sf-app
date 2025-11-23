import { AppIcon } from "@/components/AppIcon"
import BlurredListView from "@/components/BlurredListView"
import BlurredModalView from "@/components/BlurredModalView"
import MainActionButton from "@/components/buttons/MainActionButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import EmptyView from "@/components/EmptyView"
import MonthlyRecurringSummaryDisplay from "@/components/recurring-screens-items/MonthlySummaryDisplay"
import RecurringCategoryBreakdownChart from "@/components/recurring-screens-items/RecurringCategoryBreakdownChart"
import RecurringTransactionList from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionList"
import RecurringTransactionModal from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionModal"
import { useStyle } from "@/context/StyleContext"
import { useDatabase } from "@/database/useDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { RecurringTransaction } from "@/types/Transactions"
import { useHeaderHeight } from "@react-navigation/elements"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Modal, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function IncomeRecurringScreen() {
    //Style hooks
    const headerHeight = useHeaderHeight()
    const insets = useSafeAreaInsets()
    const {theme, layout} = useStyle()
    //Translation
    const {t} = useTranslation()
    //Stores
    const refreshKey = useSummaryStore((state) => state.refreshKey)
    //Database hooks
    const { getRecurringSummaryThisMonth } = useDatabase()
    //States
    const [loading, setLoading] = useState(true)
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
    const [totalRecurringIncome, setTotalRecurringIncome] = useState<number>(0)
    const [selectedRT, setSelectedRT] = useState<RecurringTransaction | null>(null)
    const [categoryTotals, setCategoryTotals] = useState<Record<number, number>>({})
    //Modal visibility states
    const [rTModalVisible, setRTModalVisible] = useState(false)
    const [chartModalVisible, setChartModalVisible] = useState(false)
    //Ref for first loading
    const hasLoadedRef = useRef(false)

    const loadData = useCallback(async (options?: { showLoading?: boolean }) => {
        //Shows loading only on first mount or when told to do so via showLoading param
        const shouldShowLoading = options?.showLoading ?? !hasLoadedRef.current

        if (shouldShowLoading) {
            setLoading(true)
        }

        try {

            const { totalRecurring, recurringTransactions, categoryTotals } = await getRecurringSummaryThisMonth("in")
            setTotalRecurringIncome(totalRecurring)
            setRecurringTransactions(recurringTransactions)
            setCategoryTotals(categoryTotals)

        } catch (err) {

            console.error("Error trying to fetch the monthly summary of recurring transactions:", {
                path: "src/app/(recurring)/incomeRecurring",
                function: "getRecurringSummaryThisMonth",
                params: { type: "in" },
                rawError: err,
            });

        } finally {

            //Registers the first mount has occurred
            hasLoadedRef.current = true

            //If it was loading, then it stops the loading view
            if (shouldShowLoading) {
                setLoading(false)
            }

        }
    }, [getRecurringSummaryThisMonth])

    //Opens recurring transaction modal of the selected transaction
    const handleItemPress = (item: RecurringTransaction) => {
        setSelectedRT(item)
        setRTModalVisible(true)
    }

    //Closes the recurring transaction modal and resets the selected recurring transaction
    const handleRTModalClose = () => {
        setRTModalVisible(false)
        setSelectedRT(null)
    }

    //Closes the modal with the distribution chart
    const handleChartModalClose = () => {
        setChartModalVisible(false)
    }

    const handleDeleteSuccess = useCallback(() => {
        void loadData({ showLoading: false })
    }, [loadData])


    useEffect(() => {
        void loadData()
    }, [loadData, refreshKey])

    //Loading indicator
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
            {totalRecurringIncome != 0? (
                <View
                    style={{
                        flex: 1,
                        paddingTop: headerHeight + layout.margin.contentArea,
                        gap: 16
                    }}
                >

                    <MonthlyRecurringSummaryDisplay
                        monthlyTotal={totalRecurringIncome}
                    />
                    
                    <BlurredListView
                        title={t("recurring.income.allTransactions")}
                    >
                        <RecurringTransactionList
                            data={recurringTransactions}
                            onItemPress={handleItemPress}
                        />
                    </BlurredListView>

                    <View style={{paddingHorizontal: 18}}>
                        <MainActionButton
                            label={t("recurring.income.showDistribution")}
                            color={theme.colors.green}
                            onPress={() => setChartModalVisible(true)}
                        />
                    </View>
                    

                </View>
            ) : (
                <EmptyView
                    icon={
                        <AppIcon
                            name={"arrow.trianglehead.clockwise"}
                            androidName={"autorenew"}
                            size={70}
                            tintColor={theme.colors.green}
                        />
                    }
                    title={t("recurring.income.empty.title")}
                    subtitle={t("recurring.income.empty.description")}
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
                    <RecurringCategoryBreakdownChart categoryTotals={categoryTotals} flowType="in" />
                    <PrimaryButton label={t("buttons.return")} onPress={handleChartModalClose}/>
                </BlurredModalView>
            </Modal>

        </View>
    )
}
