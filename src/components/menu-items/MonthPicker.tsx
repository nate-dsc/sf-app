import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { MIStyles } from "./MenuItemStyles"

type MonthPickerProps = {
    selectedMonths: number[],
    onMonthPress: (month: number) => void
}

export default function MonthPicker({selectedMonths=[], onMonthPress}: MonthPickerProps) {

    const {t} = useTranslation()
    const {theme, preference, setPreference} = useStyle()
    const menuStyles = MIStyles(theme)

    const monthLabels = [
        t("modalRecurring.sm1"), t("modalRecurring.sm2"), t("modalRecurring.sm3"), t("modalRecurring.sm4"),
        t("modalRecurring.sm5"), t("modalRecurring.sm6"), t("modalRecurring.sm7"), t("modalRecurring.sm8"),
        t("modalRecurring.sm9"), t("modalRecurring.sm10"), t("modalRecurring.sm11"), t("modalRecurring.sm12")
    ]

    const rows = [[0,1,2,3],[4,5,6,7],[8,9,10,11]]

    return(
        <View style={ menuStyles.monthPicker }>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={ menuStyles.monthPickerRow }>
                {row.map((month) => {
                    const isSelected = selectedMonths.includes(month)
                    return (
                        <TouchableOpacity key={month} style={{ flex: 1 }} onPress={() => onMonthPress(month)}>
                            <View
                            style={[menuStyles.monthPickerItem, isSelected && menuStyles.monthPickerSelectedItem]}>
                            <Text style={[FontStyles.numBody, isSelected ?  menuStyles.textOverTint : menuStyles.text]}>
                                {monthLabels[month]}
                            </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
                </View>
                
            ))}
      
    </View>
    )
}

