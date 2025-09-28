import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "../styles/TileStyles"


type DistributionProps = {
    value?: number,
    description?: string,
    isOutflow?: boolean,
    style?: ViewStyle
}

export default function DistributionTile({value, description, isOutflow, style}: DistributionProps) {

    return(
        <View style={[TileStyles.container, style]}>
            <Text style={FontStyles.mainTitle}>Distribution</Text>
        </View>
    )

}