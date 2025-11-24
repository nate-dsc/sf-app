import BaseView from "@/components/BaseView"
import DateButton from "@/components/history-screen-items/Date/DateButton"
import DateModal from "@/components/history-screen-items/Date/DateModal"
import FilterButton from "@/components/history-screen-items/Filter/FilterButton"
import FilterModal from "@/components/history-screen-items/Filter/FilterModal"
import OrderButton from "@/components/history-screen-items/Order/OrderButton"
import OrderModal from "@/components/history-screen-items/Order/OrderModal"
import SearchBar from "@/components/history-screen-items/SearchBar"
import TransactionList from "@/components/history-screen-items/TransactionList/TransactionList"
import TransactionModal from "@/components/history-screen-items/TransactionList/TransactionModal"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { useSearchFilters } from "@/context/SearchFiltersContext"
import { SCOption } from "@/types/Components"
import { Transaction, TransactionTypeFilter } from "@/types/Transactions"

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Modal, View } from "react-native"

export default function TransactionHistoryScreen() {

    const headerHeight = useHeaderHeight()
    const tabBarHeight = useBottomTabBarHeight()

    const router = useRouter()

    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all")
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [filterModalVisible, setFilterModalVisible] = useState(false)
    const [dateModalVisible, setDateModalVisible] = useState(false)
    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const {filters, updateFilters, filtersActive, sortActive} = useSearchFilters()


    const typeOptions: SCOption<TransactionTypeFilter>[] = [
        {label: "Todas", value: "all"},
        {label: "Entradas", value: "in"},
        {label: "Saídas", value: "out"}
    ]

    const handleItemPress = (item: Transaction) => {
        setSelectedTransaction(item)
        setModalVisible(true)
    }

    const handleModalClose = () => {
        setModalVisible(false)
    }

    const handleFilterModalClose = () => {
        setFilterModalVisible(false)
    }

    const handleDateModalClose = () => {
        setDateModalVisible(false)
    }

    const handleOrderModalClose = () => {
        setOrderModalVisible(false)
    }

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <View
                style={{
                    marginHorizontal: 16,
                    gap: 16,
                    marginBottom: 16
                }}
            >

            <SegmentedControlCompact 
                options={typeOptions}
                selectedValue={filters.type}
                onChange={(typeOption) => updateFilters({type: typeOption})}
            />
            <BaseView
                style={{
                    paddingHorizontal: 6,
                    paddingVertical: 6,
                    borderRadius: 32
                }}
            >

                <View style={{flexDirection: "row", gap: 6}}>
                    <View style={{flex: 1}}>
                        <SearchBar 
                            value={filters.textSearch}
                            onChangeText={(input) => updateFilters({textSearch: input})}
                        />
                    </View>
                    
                    <FilterButton
                        onPress={() => setFilterModalVisible(true)}
                        //onPress={() => router.push("/FilterModalSheet")}
                        isActive={filtersActive}
                    />

                    <DateButton 
                        onPress={() => setDateModalVisible(true)}
                        isActive={filters.dateFilterActive ?? false}
                    />

                    <OrderButton 
                        onPress={() => setOrderModalVisible(true)}
                        isActive={sortActive}
                    />
                </View>
                
            </BaseView>
            </View>
           
            <View style={{flex: 1}}>
                <TransactionList filters={filters} onItemPress={handleItemPress}/>
            </View>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <TransactionModal transaction={selectedTransaction} onBackgroundPress={handleModalClose} />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={handleFilterModalClose}
            >
                <FilterModal onBackgroundPress={handleFilterModalClose} />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={dateModalVisible}
                onRequestClose={handleDateModalClose}
            >
                <DateModal onBackgroundPress={handleDateModalClose} />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={orderModalVisible}
                onRequestClose={handleOrderModalClose}
            >
                <OrderModal onBackgroundPress={handleOrderModalClose} />
            </Modal>
        </View>
    )
}