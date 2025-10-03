import { ButtonStyles } from "@/components/buttons/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function CancelButton({...rest}: TouchableOpacityProps) {

    const theme = useTheme()
    const buttonStyles = ButtonStyles(theme.theme)

    return(
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={rest.onPress}>
            <Text style={[FontStyles.title1, {fontWeight: "bold", color: "#F5F5F5"}]}> Cancel </Text>
        </TouchableOpacity>
    )
}