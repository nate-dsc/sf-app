import { useTheme } from "@/context/ThemeContext"
import { type inflow } from "@/types/TilesTypes"
import { Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"

type InflowProps = {
    inflow: inflow
}

export default function InflowTile({inflow}: InflowProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme)

    const inflowStr = inflow.monthlyPreference ? inflow.monthlyInflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"}) : inflow.last30daysInflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={[tileStyles.container]}>
            <Text style={[tileStyles.text, FontStyles.title2]}>Inflow</Text>
            <Text style={[tileStyles.text, FontStyles.numTitle1]}>{inflowStr}</Text>
        </View>
    )
}
