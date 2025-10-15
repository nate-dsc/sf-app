import BudgetTile from "@/components/home-screen-items/BudgetTile"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import InflowTile from "@/components/home-screen-items/InflowTile"
import LastTransactionTile from "@/components/home-screen-items/LastTransactionTile"
import OutflowTile from "@/components/home-screen-items/OutflowTile"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, View } from "react-native"

export default function HomeScreen() {

    const router = useRouter()

    const [isAddModalVisible, setAddModalVisible] = useState(false)

    const headerHeight = useHeaderHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight + 10}}>
            <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: 16, gap: 12}}>
                    <BudgetTile/>
                <View style={{ flexDirection: "row", justifyContent: "center", columnGap: 12}}>
                    <View style={{flex: 1}}>
                        <InflowTile/>
                    </View>
                    <View style={{flex: 1}}>
                        <OutflowTile/>
                    </View>
                </View>
                    <LastTransactionTile/>
                    <DistributionTile style={{}}/>
            </ScrollView>
        </View>
    )
}