import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { TileStyles } from "./TileStyles"

type BudgetTileProps = {
    monthlyBudget: number,
    monthlyBalance: number,
    budgetPreference: boolean,
    style?: ViewStyle
}

export default function BudgetTile({ monthlyBudget, monthlyBalance, budgetPreference, style}: BudgetTileProps) {

    const theme = useTheme()
    const tileStyles = TileStyles(theme.theme)

    const budgetStr = monthlyBudget.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})
    const balanceStr = monthlyBalance.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={tileStyles.container}>

            <Text style={[tileStyles.text, FontStyles.title2]}>Budget</Text>
            <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numLargeTitle]}>{balanceStr}</Text>
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={[tileStyles.textUnfocused, FontStyles.title3]}>of </Text>
                <Text style={[{textAlign: "right"}, tileStyles.textUnfocused, FontStyles.numTitle3]}>{budgetStr}</Text>
            </View>

        </View>
    )
}