import { useTheme } from "@/context/ThemeContext"
import { Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"

type RecurringSummaryDisplayProps = {
    monthlyTotal: number
}

export default function MonthlyRecurringSummaryDisplay({monthlyTotal}: RecurringSummaryDisplayProps) {

    const {theme} = useTheme()
    const realValue = monthlyTotal/100
    const totalStr = realValue.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    Total do mês
                </Text>
            </View>
            <View 
                style={{
                    backgroundColor: theme.background.elevated.bg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 15
                }}
            >
                <Text style={[{textAlign: "right", color: theme.text.label}, FontStyles.numLargeTitle]}>{totalStr}</Text>
                
            </View>
        </View>
    )

}