import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, View, ViewStyle } from "react-native"
import { TileStyles } from "../styles/TileStyles"

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

    if(budgetPreference) {
        return(
            <View style={[tileStyles.container, style]}>
                <Text style={FontStyles.mainTitle}>Budget</Text>
                <Text style={FontStyles.mainNumDisplay}>{budgetStr}</Text>
                <Text style={FontStyles.secondaryTitle}>Balance</Text>
                <Text style={FontStyles.secondaryNumDisplay}>{balanceStr}</Text>
            </View>
        )
    } else {
        return(
            <View style={tileStyles.container}>
                <Text style={FontStyles.mainTitle}>Balance</Text>
                <Text style={FontStyles.mainNumDisplay}>{balanceStr}</Text>
                <Text style={FontStyles.secondaryTitle}>Budget</Text>
                <Text style={FontStyles.secondaryNumDisplay}>{budgetStr}</Text>
            </View>
        )
    }
}