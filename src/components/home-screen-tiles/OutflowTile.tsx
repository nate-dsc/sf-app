import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


type OutflowTileProps = {
    monthlyOutflow: number,
    last30daysOutflow: number,
    monthlyPreference: boolean,
    style?: ViewStyle
}

export default function OutflowTile({ monthlyOutflow, last30daysOutflow, monthlyPreference, style}: OutflowTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const outflowStr = monthlyPreference ? monthlyOutflow.toString() : last30daysOutflow.toString()

    return(
        <View style={[tileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Outflow</Text>
            <Text style={FontStyles.mainNumDisplay}>{outflowStr}</Text>
        </View>
    )
}