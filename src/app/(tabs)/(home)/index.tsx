import BudgetTile from "@/components/home-screen-items/BudgetTile"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import InflowTile from "@/components/home-screen-items/InflowTile"
import LastTransactionTile from "@/components/home-screen-items/LastTransactionTile"
import OutflowTile from "@/components/home-screen-items/OutflowTile"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView } from "react-native"

export default function HomeScreen() {

    const headerHeight = useHeaderHeight()

    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{}}
            contentContainerStyle={{flex: 1, paddingHorizontal: 16, gap: 12, paddingBottom: 130, paddingTop: 10}}
        >
            <BudgetTile />
        
            <InflowTile />
            
            <OutflowTile />

            <LastTransactionTile />

            <DistributionTile />
        </ScrollView>
    )
}