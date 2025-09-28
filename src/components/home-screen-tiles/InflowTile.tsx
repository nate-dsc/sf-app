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

    const inflowStr = monthlyPreference ? monthlyInflow.toString() : last30daysInflow.toString()

    return(
        <View style={[TileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Inflow</Text>
            <Text style={FontStyles.mainNumDisplay}>{inflowStr}</Text>
        </View>
    )
}
