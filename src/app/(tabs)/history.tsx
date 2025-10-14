import TransactionList from "@/components/history-screen-items/TransactionList"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import { SStyles } from "@/components/styles/ScreenStyles"
import { Transaction } from "@/database/useTransactionDatabase"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { View } from "react-native"

export default function TransactionHistoryScreen() {

    const headerHeight = useHeaderHeight()
    const tabBarHeight = useBottomTabBarHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <View style={SStyles.mainContainer}>
                <DistributionTile style={{flex: 1}}/>
                <View style={{flex: 5}}>
                    <TransactionList filters={{
                        category: undefined,
                        type: "all"
                    }} onItemPress={function (item: Transaction): void {
                        throw new Error("Function not implemented.")
                    } }/>
                </View>
            </View>
            
        </View>
    )
}