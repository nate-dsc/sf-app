import { ButtonStyles } from "@/components/buttons/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

type CancelButtonProps = TouchableOpacityProps & {
    buttonText: string
}

export default function CancelButton({buttonText, ...rest}: CancelButtonProps) {

    const {theme, preference, setPreference} = useStyle()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={rest.onPress}>
            <Text style={[FontStyles.title2, {color: theme.menuItem.textOverTint}]}>{buttonText}</Text>
        </TouchableOpacity>
    )
}