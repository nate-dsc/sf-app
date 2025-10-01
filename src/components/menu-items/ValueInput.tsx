import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type ValueInputProps = TextInputProps & {
    leftText: string
}

export default function ValueInput({leftText, ...rest}: ValueInputProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme)

    return(
        <View style={menuStyles.input}>
            <View style={menuStyles.inputTextContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{leftText}</Text>
            </View>
            <View style={menuStyles.inputContainer}>
                <TextInput
                    style={[menuStyles.text, FontStyles.numBody]}
                    placeholder="0.00"
                    placeholderTextColor={menuStyles.unfocusedText.color}
                    inputMode="decimal"
                    onChangeText={rest.onChangeText}
                    textAlign="right"
                />
            </View>
        </View>
    )

    /* return(
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
    ) */
}