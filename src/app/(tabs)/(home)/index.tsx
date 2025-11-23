import BudgetTile from "@/components/home-screen-items/BudgetTile"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import InflowTile from "@/components/home-screen-items/InflowTile"
import LastTransactionTile from "@/components/home-screen-items/LastTransactionTile"
import OutflowTile from "@/components/home-screen-items/OutflowTile"
import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"

export default function HomeScreen() {

    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()


    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 130, paddingTop: 10}}
        >
            
            <BudgetTile />

            <InflowTile />
            
            <OutflowTile />

            <LastTransactionTile />

            <DistributionTile />
        </ScrollView>
    )
}