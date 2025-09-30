import { FontStyles } from "@/components/styles/FontStyles";
import { InputStyles } from "@/components/styles/InputStyles";
import { useTheme } from "@/context/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View } from "react-native";



export default function DateInput() {

    const theme = useTheme()
    const inputStyles = InputStyles(theme)

    return(
        <View style={[{flexDirection: "row", alignItems: "center"}, inputStyles.datePickerField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Date
            </Text>

            <View style={{flex: 3, alignItems: "flex-end"}}>
                <DateTimePicker
                    value={new Date()}
                    display="compact"
                    themeVariant="light"
                    style={{padding: 0}}
                />
            </View>
        </View>
    )
}