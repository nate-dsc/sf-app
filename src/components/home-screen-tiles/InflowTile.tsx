import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "../styles/TileStyles"


type InflowTileProps = {
    monthlyInflow: number,
    last30daysInflow: number,
    monthlyPreference: boolean,
    style?: ViewStyle
}

export default function InflowTile({ monthlyInflow, last30daysInflow, monthlyPreference, style}: InflowTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const inflowStr = monthlyPreference ? monthlyInflow.toString() : last30daysInflow.toString()

    return(
        <View style={[tileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Inflow</Text>
            <Text style={FontStyles.mainNumDisplay}>{inflowStr}</Text>
        </View>
    )
}
