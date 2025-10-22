import DateButton from "@/components/history-screen-items/Date/DateButton"
import DateModal from "@/components/history-screen-items/Date/DateModal"
import FilterButton from "@/components/history-screen-items/Filter/FilterButton"
import FilterModal from "@/components/history-screen-items/Filter/FilterModal"
import OrderButton from "@/components/history-screen-items/Order/OrderButton"
import OrderModal from "@/components/history-screen-items/Order/OrderModal"
import SearchBar from "@/components/history-screen-items/SearchBar"
import TransactionList from "@/components/history-screen-items/TransactionList/TransactionList"
import TransactionModal from "@/components/history-screen-items/TransactionList/TransactionModal"
import { SCOption } from "@/components/menu-items/SegmentedControl"
import SegmentedControlCompact from "@/components/menu-items/SegmentedControlCompact"
import { TransactionTypeFilter, useSearchFilters } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { Transaction } from "@/database/useTransactionDatabase"
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

    const handleFilterModalClose = () => {
        setFilterModalVisible(false)
    }

    const handleDateModalClose = () => {
        setDateModalVisible(false)
    }

    const handleOrderModalClose = () => {
        setOrderModalVisible(false)
    }

    const {theme} = useTheme()

    return(
        <View style={{flex: 1, paddingTop: headerHeight + 10}}>
            <View style={{
                marginHorizontal: 16,
                marginBottom: 10,
                padding: 5,
                borderRadius: 30,
                borderWidth: 1,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderCurve: "continuous",
                backgroundColor: theme.background.group.secondaryBg,
                borderColor: theme.background.group.tertiaryBg,
            }}>
                <View style={{
                    paddingBottom: 12,
                }}>
                        <SegmentedControlCompact 
                            options={typeOptions}
                            selectedValue={filters.type}
                            onChange={(typeOption) => updateFilters({type: typeOption})}
                        />
                    </View>

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