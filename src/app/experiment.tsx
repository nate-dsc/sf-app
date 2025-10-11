import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import { type SCOption } from "@/components/menu-items/SegmentedControl"
import { SStyles } from "@/components/styles/ScreenStyles"
import { ThemePreference, useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"

export default function SettingsScreen() {

    const {t} = useTranslation()

    const router = useRouter()
    const {theme, preference, setPreference} = useTheme()

    const [category, setCategory] = useState("")
    const [selectedTheme, setSelectedTheme] = useState(preference)
    const [selectedLang, setSelectedLang] = useState(i18n.language)
    
    const menuStyles = MIStyles(theme)
    
    const paddingTop = useHeaderHeight() + 10

    const themeOptions: SCOption<ThemePreference>[] = [
        {label: t("settings.theme.system"), value: "system"},
        {label: t("settings.theme.light"), value: "light"},
        {label: t("settings.theme.dark"), value: "dark"}
    ]

    const langOptions: SCOption<string>[] = [
        {label: "English", value: "en-US"},
        {label: "Português", value: "pt-BR"}
    ]

    useEffect(() => {setSelectedTheme(preference)}, [preference])

    const changeLanguage = async (lang: string) => {
        await AsyncStorage.setItem("language", lang);
        i18n.changeLanguage(lang);
    }

    return(
        <View style={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer, {height: "60%"}]}>
            <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer, {height: "60%"}]}>
                <View style={{
                    flex: 1,
                    backgroundColor: "darkolivegreen",
                    borderWidth: 1,
                    borderRadius: 24,
                    borderColor: "lawngreen",
                }} />

            </ScrollView>

        </View>
    )


}