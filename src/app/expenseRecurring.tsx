import MonthlyRecurringSummaryDisplay from "@/components/recurring-screens-items/MonthlySummaryDisplay"
import RecurringTransactionList from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionList"
import RecurringTransactionModal from "@/components/recurring-screens-items/RecurringTransactionList/RecurringTransactionModal"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { TransactionRecurring, useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useHeaderHeight } from "@react-navigation/elements"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Modal, Text, View } from "react-native"

export default function ExpenseRecurringScreen() {
    const { getRecurringSummaryThisMonth } = useTransactionDatabase()
    const [loading, setLoading] = useState(true)
    const [recurringTransactions, setRecurringTransactions] = useState<TransactionRecurring[]>([])
    const [totalRecurringIncome, setTotalRecurringIncome] = useState<number>(0)
    const [rTModalVisible, setRTModalVisible] = useState(false)
    const [selectedRT, setSelectedRT] = useState<TransactionRecurring | null>(null)
    const headerHeight = useHeaderHeight()
    const {theme} = useTheme()

    const handleItemPress = (item: TransactionRecurring) => {
        setSelectedRT(item)
        setRTModalVisible(true)
    }

    const handleRTModalClose = () => {
        setRTModalVisible(false)
    }

    useEffect(() => {
        async function loadData() {
        try {
            setLoading(true)
            const { totalRecurringIncome, recurringIncomeTransactions } = await getRecurringSummaryThisMonth("outflow")
            setTotalRecurringIncome(totalRecurringIncome)
            setRecurringTransactions(recurringIncomeTransactions)
        } catch (err) {
            console.error("Erro ao carregar transações recorrentes:", err)
        } finally {
            setLoading(false)
        }
        }

        loadData()
    }, [])

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
                <RecurringTransactionModal transaction={selectedRT} onBackgroundPress={handleRTModalClose} />
            </Modal>
        </View>
    )
}
