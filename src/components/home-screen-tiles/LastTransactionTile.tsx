import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


type LastTransactionTileProps = {
    value: number,
    description: string,
    isOutflow: boolean,
    style?: ViewStyle
}

export default function LastTransactionTile({value, description, isOutflow, style}: LastTransactionTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={[tileStyles.container, style]}>
            <Text style={FontStyles.title2}>Last transaction</Text>
            <Text style={[{textAlign: "right"}, FontStyles.numTitle1]}>{valueStr}</Text>
        </View>
    )

}