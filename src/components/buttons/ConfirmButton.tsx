import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"
import { ButtonStyles } from "./ButtonStyles"



export default function ConfirmButton({...rest}: TouchableOpacityProps) {

    const {theme, preference, setPreference} = useTheme()
    const buttonStyles = ButtonStyles(theme)
    const {t} = useTranslation()

    return(
        <TouchableOpacity style={[buttonStyles.confirmButton, rest.style]} onPress={rest.onPress} disabled={rest.disabled}>
            <Text style={[FontStyles.title2, {color: rest.disabled ? theme.menuItem.text : theme.menuItem.textOverTint}]}>{t("buttons.save")}</Text>
        </TouchableOpacity>
    )
}