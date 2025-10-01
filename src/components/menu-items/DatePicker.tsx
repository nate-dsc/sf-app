import { FontStyles } from "@/components/styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View } from "react-native";
import { MIStyles } from "./MenuItemStyles";

type DatePickerProps = {
    text: string
}

export default function DatePicker({text}: DatePickerProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme)

    return(
        <View style={menuStyles.datePicker}>
            <View style={menuStyles.textContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{text}</Text>
            </View>
            <View style={menuStyles.datetimePickerContainer}>
                <DateTimePicker
                    value={new Date()}
                    display="compact"
                />
            </View>
        </View>
    )

}