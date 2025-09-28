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

    const valueStr = value.toString()

    return(
        <View style={[TileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Last transaction</Text>
            <Text style={FontStyles.mainNumDisplay}>{valueStr}</Text>
        </View>
    )

}