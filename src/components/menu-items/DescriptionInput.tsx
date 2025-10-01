import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type DescriptionInputProps = TextInputProps & {
    leftText: string
}

export default function DescriptionInput({leftText, ...rest}: DescriptionInputProps) {

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
                        style={[menuStyles.text, FontStyles.body]}
                        inputMode="text"
                        placeholder="None"
                        placeholderTextColor={menuStyles.unfocusedText.color}
                        onChangeText={rest.onChangeText}
                        textAlign="right"
                    />
                </View>
            </View>
        )

    /* const theme = useTheme()
    const inputStyles = InputStyles(theme)

    return(
        <View style={[{flexDirection: "row", alignItems: "baseline"}, inputStyles.smallInputField]}>
            <View style={menuStyles.inputTextContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{leftText}</Text>
            </View>
            <View style={menuStyles.inputContainer}>
                <TextInput
                    style={[menuStyles.text, FontStyles.body]}
                    inputMode="text"
                    placeholder="None"
                    placeholderTextColor={menuStyles.unfocusedText.color}
                    onChangeText={rest.onChangeText}
                    textAlign="right"
                />
            </View>
        </View>
    ) */
}