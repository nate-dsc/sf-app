import { useStyle } from "@/context/StyleContext"
import { Text, TouchableOpacity, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { MIStyles } from "./MenuItemStyles"

type DayPickerProps = {
    selectedDays: number[],
    onDayPress: (day: number) => void
}

export default function DayPicker({selectedDays=[], onDayPress}: DayPickerProps) {

    const {theme, preference, setPreference} = useStyle()
    const menuStyles = MIStyles(theme)

    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const rows: number[][] = []
    const today = new Date().getDate()
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))

    return(
        <View style={ menuStyles.dayPicker }>
            {rows.map((row, rowIndex) => (
                <View
                key={rowIndex}
                style={[menuStyles.dayPickerRow, rowIndex === rows.length - 1 && menuStyles.dayPickerRowLast]}>
                {row.map((day) => {
                    const isSelected = selectedDays.includes(day)
                    return (
                    <TouchableOpacity
                        key={day}
                        style={menuStyles.dayPickerCell}
                        activeOpacity={0.7}
                        onPress={() => onDayPress(day)}>
                        <View
                        style={[menuStyles.dayPickerItem, isSelected && menuStyles.dayPickerSelectedItem]}>
                        <Text
                        style={[
                            FontStyles.numBody,
                            isSelected
                                ? menuStyles.textOverTint
                                : day === today
                                    ? menuStyles.dayPickerTodayText
                                    : menuStyles.text,
                        ]}>
                            {day}
                        </Text>
                        </View>
                    </TouchableOpacity>
                    
                    )
                })}
                {Array.from({ length: 7 - row.length }).map((_, i) => (
                    <View key={`empty-${i}`} style={ menuStyles.dayPickerPaddingView } />
                ))}
                </View>
                
            ))}
      
    </View>
    )
}

