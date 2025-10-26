import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type MonthPickerProps = {
    selectedMonths: number[],
    onMonthPress: (month: number) => void
}

export default function MonthPicker({selectedMonths=[], onMonthPress}: MonthPickerProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

    const monthLabels = [
        t("modalRecurring.sm1"), t("modalRecurring.sm2"), t("modalRecurring.sm3"), t("modalRecurring.sm4"),
        t("modalRecurring.sm5"), t("modalRecurring.sm6"), t("modalRecurring.sm7"), t("modalRecurring.sm8"),
        t("modalRecurring.sm9"), t("modalRecurring.sm10"), t("modalRecurring.sm11"), t("modalRecurring.sm12")
    ]

    const rows = [[0,1,2,3],[4,5,6,7],[8,9,10,11]]

    return(
        <View
            style={{
                aspectRatio: 8 / 3,
                width: "100%",
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: theme.fill.secondary,
                gap: StyleSheet.hairlineWidth
            }}
        >
            {rows.map((row, rowIndex) => (
                <View
                    key={rowIndex}
                    style={{
                        flex: 1,
                        flexDirection: "row", 
                        gap: StyleSheet.hairlineWidth, 
                        justifyContent: "space-evenly"
                    }}
                >
                    {row.map((month) => {
                        const isSelected = selectedMonths.includes(month)
                        return (
                            <TouchableOpacity
                                key={month}
                                style={{ flex: 1 }}
                                onPress={() => onMonthPress(month)}
                            >
                                <View
                                    style={[{
                                        flex: 1,
                                        //aspectRatio: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 8},
                                        isSelected && {backgroundColor: theme.colors.blue}
                                    ]}
                                >
                                <Text
                                    style={{lineHeight: 22, fontSize: 17, color: isSelected ? theme.colors.white : theme.text.label}}
                                >
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

