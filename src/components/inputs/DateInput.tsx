import { FontStyles } from "@/components/styles/FontStyles";
import { InputStyles } from "@/components/styles/InputStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View } from "react-native";



export default function DateInput() {
    return(
        <View style={[{flexDirection: "row", alignItems: "center"}, InputStyles.datePickerField]}>
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