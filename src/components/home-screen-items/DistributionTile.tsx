import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


type DistributionProps = {
    value?: number,
    description?: string,
    isOutflow?: boolean,
    style?: ViewStyle
}

export default function DistributionTile({value, description, isOutflow, style}: DistributionProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme.theme)

    return(
        <View style={[tileStyles.container, style]}>
            <Text style={FontStyles.title2}>Distribution</Text>
        </View>
    )

}