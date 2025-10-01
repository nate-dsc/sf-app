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
    const tileStyles = TileStyles(theme)

    const budgetStr = monthlyBudget.toString()
    const balanceStr = monthlyBalance.toString()

    return(
        <View style={tileStyles.container}>

            <Text style={[tileStyles.text, FontStyles.title2, {fontWeight: "bold"}]}>Budget</Text>
            <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.mainNumDisplay]}>R$ {balanceStr}</Text>
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={[tileStyles.textUnfocused, FontStyles.body]}>of </Text>
                <Text style={[{textAlign: "right"}, tileStyles.textUnfocused, FontStyles.secondaryNumDisplay]}>R$ {budgetStr}</Text>
            </View>

        </View>
    )
}