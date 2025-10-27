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
import { ActivityIndicator, Modal, Text, View } from "react-native"

export default function ExpenseRecurringScreen() {
    const { getRecurringSummaryThisMonth } = useTransactionDatabase()
    const [loading, setLoading] = useState(true)
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
    const [totalRecurringIncome, setTotalRecurringIncome] = useState<number>(0)
    const [rTModalVisible, setRTModalVisible] = useState(false)
    const [selectedRT, setSelectedRT] = useState<RecurringTransaction | null>(null)
    const [categoryTotals, setCategoryTotals] = useState<Record<number, number>>({})
    const headerHeight = useHeaderHeight()
    const {theme} = useStyle()
    const refreshKey = useSummaryStore((state) => state.refreshKey)
    const hasLoadedRef = useRef(false)

    const loadData = useCallback(async (options?: { showLoading?: boolean }) => {
        const shouldShowLoading = options?.showLoading ?? !hasLoadedRef.current

        if (shouldShowLoading) {
            setLoading(true)
        }

        try {
            const { totalRecurring, recurringTransactions, categoryTotals } = await getRecurringSummaryThisMonth("outflow")
            setTotalRecurringIncome(totalRecurring)
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
        <View style={{ flex: 1, paddingTop: headerHeight, gap: 10}}>
            <View style={{paddingHorizontal: 16, paddingTop: 10}}>
                <MonthlyRecurringSummaryDisplay monthlyTotal={totalRecurringIncome}/>
            </View>
            <View style={{paddingHorizontal: 16}}>
                <RecurringCategoryBreakdownChart categoryTotals={categoryTotals} flowType="outflow" />
            </View>

            <View style={{paddingHorizontal: 32}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    Todas as despesas recorrentes
                </Text>
            </View>
            
            <RecurringTransactionList data={recurringTransactions} onItemPress={handleItemPress} />

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
        </View>
    )
}
