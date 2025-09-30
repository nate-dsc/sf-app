import { ButtonStyles } from "@/components/styles/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function ConfirmButton({...rest}: TouchableOpacityProps) {

    const theme = useTheme()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={buttonStyles.confirmButton} onPress={rest.onPress} disabled={rest.disabled}>
            <Text style={[FontStyles.mainTitle, {color: "#fff"}]}> Confirm </Text>
        </TouchableOpacity>
    )
}