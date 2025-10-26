import { useStyle } from "@/context/StyleContext"
import { Text, TouchableOpacity, View } from "react-native"

type SingleDayPickerProps = {
    selectedDay: number,
    onDayPress: (day: number) => void
}

export default function SingleDayPicker({selectedDay, onDayPress}: SingleDayPickerProps) {

    const {theme, layout} = useStyle()

    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const rows: number[][] = []
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))

    return(
        <View 
            style={{
                //backgroundColor: theme.fill.secondary,
                //borderRadius: layout.radius.groupedView
            }}
        >
            {rows.map((row, rowIndex) => (
                <View
                    key={rowIndex}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                    }}
                >
                {row.map((day) => {
                    const isSelected = selectedDay === day
                    return (
                    <TouchableOpacity
                        key={day}
                        style={{
                            width: 44,
                            height: 44
                        }}
                        onPress={() => onDayPress(day)}
                    >
                        <View
                            style={[{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                justifyContent: "center",
                                alignItems: "center"},
                                isSelected && {backgroundColor: theme.colors.blue}
                            ]}     
                        >
                            <Text
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    lineHeight: 25,
                                    fontSize: isSelected ? 22 : 20,
                                    fontWeight: isSelected ? "500" : "400",
                                    color: isSelected ? theme.colors.white : theme.text.label
                                }}
                            >
                                {day}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                    )
                })}
                {Array.from({ length: 7 - row.length }).map((_, i) => (
                    <View key={`empty-${i}`} style={{width: 44, height: 44}} />
                ))}
                </View>
            ))}
    </View>
    )
}

