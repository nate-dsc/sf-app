import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function ValueInput({...rest}: TextInputProps) {

    const theme = useTheme()
    const inputStyles = InputStyles(theme)

    return(
        <View style={[{flexDirection: "row", alignItems: "center"}, inputStyles.smallInputField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Value
            </Text>

            <TextInput
                style={[{flex: 3}, FontStyles.numBody]}
                placeholder="0.00"
                placeholderTextColor={"gray"}
                inputMode="decimal"
                onChangeText={rest.onChangeText}
                textAlign="right"
            />
        </View>
    )
}