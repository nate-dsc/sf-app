import FilterButton from "@/components/history-screen-items/FilterButton"
import FilterModal from "@/components/history-screen-items/FilterModal"
import SearchBar from "@/components/history-screen-items/SearchBar"
import TransactionList from "@/components/history-screen-items/TransactionList"
import TransactionModal from "@/components/history-screen-items/TransactionModal"
import { SCOption } from "@/components/menu-items/SegmentedControl"
import SegmentedControlCompact from "@/components/menu-items/SegmentedControlCompact"
import { TransactionTypeFilter, useSearchFilters } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { Transaction } from "@/database/useTransactionDatabase"
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
    const [filterModalVisible, setFilterModalVisible] = useState(false)
    const {filters, updateFilters, filtersActive} = useSearchFilters()


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

    const {theme} = useTheme()

    return(
        <View style={{flex: 1, paddingTop: headerHeight + 10}}>
            <View style={{
                //flex: 1,
                //position: "absolute",
                //top: headerHeight + 10,
                //left: 0,
                //right: 0,
                marginHorizontal: 16,
                marginBottom: 10,
                padding: 6,
                borderRadius: 30,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderCurve: "continuous",
                backgroundColor: theme.background.group.secondaryBg,
                zIndex: 1
            }}>
                <View style={{
                    paddingBottom: 12,
                    //paddingTop: 6
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
                    
                    <FilterButton onPress={() => setFilterModalVisible(true)} isActive={filtersActive}/>
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
        </View>
    )
}