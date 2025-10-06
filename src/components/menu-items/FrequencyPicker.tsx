import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Frequency } from "rrule"
import { FontStyles } from "../styles/FontStyles"
import { MIStyles } from "./MenuItemStyles"

type Options = {
    label: string,
    frequency: Frequency
}

type FrequencyPickerProps = {
    options: Options,
    selectedValue: Frequency,
    onValueChange: (freq: Frequency) => void
}

export default function FrequencyPicker({options, selectedValue, onValueChange}: FrequencyPickerProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)

    const [showOptions, setShowOptions] = useState(true)


    return(
        <View>
            <TouchableOpacity
                onPress={()=> {setShowOptions(!showOptions)}}
                style={menuStyles.redir}
            >
                <View style={menuStyles.textChevronContainer}>
                    <View style={{flex: 1}}>
                        <Text
                            style={[menuStyles.text, FontStyles.body]}
                        >Frequência</Text>
                    </View>
                    <Ionicons name={showOptions ? "chevron-up" : "chevron-down"} size={20} color={menuStyles.icon.color}/>
                </View>
            </TouchableOpacity>
        </View>
    )

}