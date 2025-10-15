import TransactionList from "@/components/history-screen-items/TransactionList"
import SegmentedControl, { SCOption } from "@/components/menu-items/SegmentedControl"
import { SStyles } from "@/components/styles/ScreenStyles"
import { Transaction, TransactionTypeFilter } from "@/database/useTransactionDatabase"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { View } from "react-native"

export default function TransactionHistoryScreen() {

    const headerHeight = useHeaderHeight()
    const tabBarHeight = useBottomTabBarHeight()

    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all")

    const typeOptions: SCOption<TransactionTypeFilter>[] = [
        {label: "Todas", value: "all"},
        {label: "Entradas", value: "inflow"},
        {label: "Saídas", value: "outflow"}
    ] 

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <View style={[SStyles.mainContainer, {paddingBottom: 0}]}>
                <SegmentedControl 
                    options={typeOptions}
                    selectedValue={typeFilter}
                    onChange={(typeOption) => setTypeFilter(typeOption)}
                />
                <View style={{flex: 1}}>
                    <TransactionList filters={{
                        category: undefined,
                        type: typeFilter
                    }} onItemPress={function (item: Transaction): void {
                        throw new Error("Function not implemented.")
                    } }/>
                </View>
            </View>
            
        </View>
    )
}