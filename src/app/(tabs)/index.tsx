import AddButton from "@/components/add-button/AddButton"
import AddModal from "@/components/add-button/AddModal"
import BudgetTile from "@/components/home-screen-tiles/BudgetTile"
import DistributionTile from "@/components/home-screen-tiles/DistributionTile"
import InflowTile from "@/components/home-screen-tiles/InflowTile"
import LastTransactionTile from "@/components/home-screen-tiles/LastTransactionTile"
import OutflowTile from "@/components/home-screen-tiles/OutflowTile"
import { SStyles } from "@/components/screen-styles/styles"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export default function HomeScreen() {

    const router = useRouter()

    const [isAddModalVisible, setAddModalVisible] = useState(false)

    const headerHeight = useHeaderHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <ScrollView contentContainerStyle={SStyles.mainContainer}>
                    <BudgetTile style={{flex: 1}} monthlyBudget={123456} monthlyBalance={123456} budgetPreference={true} />
                <View style={{flex: 1, flexDirection: "row", justifyContent: "center", columnGap: 12}}>
                    <InflowTile style={{flex: 1}} monthlyInflow={123456} last30daysInflow={123456} monthlyPreference={true} />     
                    <OutflowTile style={{flex: 1}} monthlyOutflow={123456} last30daysOutflow={123456} monthlyPreference={true} />
                </View>
                    <LastTransactionTile style={{flex: 1}} value={123456} description="groceries" isOutflow={true}/>
                    <DistributionTile style={{flex: 1}}/>
            </ScrollView>
            <View style={{position: "absolute", bottom: 8, right: 10}}>
                <AddButton size={50} onPress={() => {router.navigate("../modalAdd")}}/>
            </View>

            <AddModal visible={isAddModalVisible} onClose={() => setAddModalVisible(false)}/>
        </View>
    )
}