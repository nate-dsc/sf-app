import { useTheme } from "@/context/ThemeContext"
import { outflow } from "@/types/TilesTypes"
import { Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


type OutflowTileProps = {
    outflow: outflow
}

export default function OutflowTile({outflow}: OutflowTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const outflowStr = outflow.monthlyPreference ? 
        outflow.monthlyOutflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})
         : outflow.last30daysOutflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={[tileStyles.container]}>
            <Text style={[tileStyles.text, FontStyles.title2]}>Outflow</Text>
            <Text style={[tileStyles.text, FontStyles.numTitle1]}>{outflowStr}</Text>
        </View>
    )
}