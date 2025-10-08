import { FontStyles } from "@/components/styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";
import i18n from "@/i18n";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Text, View } from "react-native";
import { MIStyles } from "./MenuItemStyles";

type DatePickerProps = {
    text: string,
    value: Date,
    onDateChange: (value: Date) => void
}

export default function DatePicker({text, value, onDateChange}: DatePickerProps) {

    const {theme, preference, setPreference}= useTheme()
    const menuStyles = MIStyles(theme)

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // O 'selectedDate' pode ser undefined (ex: no Android ao cancelar)
        // Então, só chamamos a função do pai se uma data for realmente selecionada.
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    return(
        <View style={menuStyles.datePicker}>
            <View style={menuStyles.textContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{text}</Text>
            </View>
            <View style={menuStyles.datetimePickerContainer}>
                <DateTimePicker
                    value={value}
                    themeVariant={theme.themeName === 'light' ? 'light' : 'dark'}
                    locale={i18n.language}
                    onChange={handleDateChange}
                    display="compact"
                />
            </View>
        </View>
    )

}