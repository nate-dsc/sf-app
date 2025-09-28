import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "../styles/TileStyles"


type OutflowTileProps = {
    monthlyOutflow: number,
    last30daysOutflow: number,
    monthlyPreference: boolean,
    style?: ViewStyle
}

export default function OutflowTile({ monthlyOutflow, last30daysOutflow, monthlyPreference, style}: OutflowTileProps) {

    const outflowStr = monthlyPreference ? monthlyOutflow.toString() : last30daysOutflow.toString()

    return(
        <View style={[TileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Outflow</Text>
            <Text style={FontStyles.mainNumDisplay}>{outflowStr}</Text>
        </View>
    )
}