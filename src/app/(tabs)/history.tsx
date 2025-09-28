import DistributionTile from "@/components/home-screen-tiles/DistributionTile"
import { SStyles } from "@/components/screen-styles/styles"
import { useHeaderHeight } from "@react-navigation/elements"
import { Text, View } from "react-native"

export default function TransactionHistoryScreen() {

    const headerHeight = useHeaderHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <View style={SStyles.mainContainer}>
                <DistributionTile style={{flex: 1}}/>
                <View style={{flex: 3}}>
                    <Text> Flatlist goes here </Text>
                </View>
            </View>
            
        </View>
    )
}