import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"



export default function ConfirmButton({...rest}: TouchableOpacityProps) {

    const {theme, preference, setPreference} = useTheme()
    const {t} = useTranslation()

    return(
        <TouchableOpacity style={rest.style} onPress={rest.onPress} disabled={rest.disabled}>
            <Text style={[FontStyles.title2, {color: rest.disabled ? theme.menuItem.text : theme.menuItem.textOverTint}]}>{t("buttons.save")}</Text>
        </TouchableOpacity>
    )
}