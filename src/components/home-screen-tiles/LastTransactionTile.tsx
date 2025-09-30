import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "../styles/TileStyles"


type LastTransactionTileProps = {
    value: number,
    description: string,
    isOutflow: boolean,
    style?: ViewStyle
}

export default function LastTransactionTile({value, description, isOutflow, style}: LastTransactionTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const valueStr = value.toString()

    return(
        <View style={[tileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Last transaction</Text>
            <Text style={FontStyles.mainNumDisplay}>{valueStr}</Text>
        </View>
    )

}