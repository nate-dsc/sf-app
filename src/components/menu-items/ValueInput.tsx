import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type ValueInputProps = TextInputProps & {
    leftText: string
}

export default function ValueInput({leftText, ...rest}: ValueInputProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)

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
                    placeholder={0.00.toLocaleString(i18n.language)}
                    placeholderTextColor={menuStyles.textUnfocused.color}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    onChangeText={rest.onChangeText}
                    textAlign="right"
                />
            </View>
        </View>
    )
}