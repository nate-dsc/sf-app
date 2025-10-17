import TransactionList from "@/components/history-screen-items/TransactionList"
import TransactionModal from "@/components/history-screen-items/TransactionModal"
import { SCOption } from "@/components/menu-items/SegmentedControl"
import SegmentedControlCompact from "@/components/menu-items/SegmentedControlCompact"
import { Transaction, TransactionTypeFilter } from "@/database/useTransactionDatabase"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { Modal, View } from "react-native"

export default function TransactionHistoryScreen() {

    const headerHeight = useHeaderHeight()
    const tabBarHeight = useBottomTabBarHeight()

    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all")
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [modalVisible, setModalVisible] = useState(false)


    const typeOptions: SCOption<TransactionTypeFilter>[] = [
        {label: "Todas", value: "all"},
        {label: "Entradas", value: "inflow"},
        {label: "Saídas", value: "outflow"}
    ] 

    const handleItemPress = (item: Transaction) => {
        setSelectedTransaction(item)
        setModalVisible(true)
    }

    const handleModalClose = () => {
        setModalVisible(false)
    }

    return(
        <View style={{flex: 1, paddingTop: headerHeight + 10}}>
            <View style={{paddingHorizontal: 16, paddingBottom: 12}}>
                <SegmentedControlCompact 
                    options={typeOptions}
                    selectedValue={typeFilter}
                    onChange={(typeOption) => setTypeFilter(typeOption)}
                />
            </View>
            <View style={{flex: 1}}>
                <TransactionList filters={{
                    category: undefined,
                    type: typeFilter
                }} onItemPress={handleItemPress}/>
            </View>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <TransactionModal transaction={selectedTransaction} onBackgroundPress={handleModalClose} />
            </Modal>
        </View>
        
    )
}