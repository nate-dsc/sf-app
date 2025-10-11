import BudgetTile from "@/components/home-screen-tiles/BudgetTile"
import DistributionTile from "@/components/home-screen-tiles/DistributionTile"
import InflowTile from "@/components/home-screen-tiles/InflowTile"
import LastTransactionTile from "@/components/home-screen-tiles/LastTransactionTile"
import OutflowTile from "@/components/home-screen-tiles/OutflowTile"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export default function HomeScreen() {

    const router = useRouter()

    const [isAddModalVisible, setAddModalVisible] = useState(false)

    const paddingTop = useHeaderHeight() + 10

    return(
        <View style={{flex: 1, paddingTop: paddingTop}}>
            <ScrollView contentContainerStyle={[SStyles.mainContainer]}>
                    <BudgetTile style={{}} monthlyBudget={-999999.99} monthlyBalance={999999.99} budgetPreference={true} />
                <View style={{ flexDirection: "row", justifyContent: "center", columnGap: 12}}>
                    <InflowTile inflow={{
                        monthlyInflow: 999999.99,
                        last30daysInflow: 999999.99,
                        monthlyPreference: true
                    }}  />     
                    <OutflowTile outflow={{
                        monthlyOutflow: 999999.99,
                        last30daysOutflow: 999999.99,
                        monthlyPreference: true
                    }} />
                </View>
                    <LastTransactionTile style={{}} value={999999.99} description="groceries" isOutflow={true}/>
                    <DistributionTile style={{}}/>
            </ScrollView>
        </View>
    )
}