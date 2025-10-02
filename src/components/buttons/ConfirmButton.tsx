import { ButtonStyles } from "@/components/buttons/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function ConfirmButton({...rest}: TouchableOpacityProps) {

    const theme = useTheme()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={buttonStyles.confirmButton} onPress={rest.onPress} disabled={rest.disabled}>
            <Text style={[FontStyles.title1, {fontWeight: "bold", color: "#F5F5F5"}]}> Save </Text>
        </TouchableOpacity>
    )
}