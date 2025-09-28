import { SStyles } from "@/components/screen-styles/styles"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView, Text, View } from "react-native"

export default function PlanningScreen() {

    const headerHeight = useHeaderHeight()

    return(
        <View style={{flex: 1, paddingTop: headerHeight}}>
            <ScrollView contentContainerStyle={SStyles.mainContainer}>
                <View style={{flex: 1}}>
                    <Text> Planning screen </Text>
                </View>
            </ScrollView>
            
        </View>
    )
}