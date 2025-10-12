import { ButtonStyles } from "@/components/buttons/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function CancelButton({...rest}: TouchableOpacityProps) {

    const {theme, preference, setPreference} = useTheme()
    const {t} = useTranslation()
    const buttonStyles = ButtonStyles(theme)

    return(
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={rest.onPress}>
            <Text style={[FontStyles.title2, {color: theme.menuItem.textOverTint}]}>{t("buttons.cancel")}</Text>
        </TouchableOpacity>
    )
}