import Redir from "@/components/menu-items/Redir"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView } from "react-native"

export default function SettingsScreen() {
    
    const headerHeight = useHeaderHeight()

    return(
        <ScrollView contentContainerStyle={[{paddingTop: headerHeight, marginTop: 4}, SStyles.mainContainer]}>
            <Redir iconName="cog" text="Test setting" onPress={() => {}} />
        </ScrollView>
    )
}