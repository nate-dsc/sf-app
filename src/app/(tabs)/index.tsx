import BudgetTile from "@/components/home-screen-items/BudgetTile"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import InflowTile from "@/components/home-screen-items/InflowTile"
import LastTransactionTile from "@/components/home-screen-items/LastTransactionTile"
import OutflowTile from "@/components/home-screen-items/OutflowTile"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView, View } from "react-native"

export default function HomeScreen() {

    const headerHeight = useHeaderHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight + 10}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{}}
                contentContainerStyle={{paddingHorizontal: 16, gap: 12, paddingBottom: 130}}
            >
                <BudgetTile />
            
                <InflowTile />
                
                <OutflowTile />

                <LastTransactionTile />

                <DistributionTile />
            </ScrollView>
        </View>
    )
}