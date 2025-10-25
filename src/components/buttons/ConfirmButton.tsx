import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"
import { ButtonStyles } from "./ButtonStyles"

type ConfirmButtonProps = TouchableOpacityProps & {
    buttonText: string
}

export default function ConfirmButton({buttonText, ...rest}: ConfirmButtonProps) {

    const {theme, preference, setPreference} = useStyle()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={[buttonStyles.confirmButton, rest.style]} onPress={rest.onPress} disabled={rest.disabled}>
            <Text style={[FontStyles.title2, {color: rest.disabled ? theme.menuItem.text : theme.menuItem.textOverTint}]}>{buttonText}</Text>
        </TouchableOpacity>
    )
}