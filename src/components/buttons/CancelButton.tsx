import { ButtonStyles } from "@/components/styles/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function CancelButton({...rest}: TouchableOpacityProps) {

    const theme = useTheme()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={rest.onPress}>
            <Text style={[FontStyles.mainTitle, {color: "#fff"}]}> Cancel </Text>
        </TouchableOpacity>
    )
}