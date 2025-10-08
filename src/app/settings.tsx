import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import Redir from "@/components/menu-items/Redir"
import SegmentedControl, { type SCOption } from "@/components/menu-items/SegmentedControl"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { ThemePreference, useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text } from "react-native"

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
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>

            <Text style={[menuStyles.text, FontStyles.title2]}> Debug </Text>

            <Redir iconName="hammer" text="Teste 1" onPress={() => {router.push("/experiment")}} />

            <Redir iconName="hammer" text="Teste 2" onPress={() => {router.push("/experiment2")}} />

            <Redir iconName="move-outline" text="MEDIR COMPONENTES" onPress={() => {router.push("/measures")}} />

            <Redir iconName="add-outline" text="MODAL ADICIONAR" onPress={() => {router.push("/modalAdd")}} />

            <Redir iconName="sync-outline" text="MODAL RECORRENCIA" onPress={() => {router.push("/modalRecurring")}} />
            
            <Redir iconName="list-outline" text="MODAL CATEGORIAS" onPress={() => {router.push("/modalCategoryPicker")}} />

            <Text style={[{color: menuStyles.text.color}, FontStyles.headline]}> ESTADO DO APP </Text>

            <SegmentedControl
                options={themeOptions}
                selectedValue={selectedTheme}
                onChange={(optionTheme) => {
                    setSelectedTheme(optionTheme)
                    setPreference(optionTheme)
                }}
            />

            <SegmentedControl
                options={langOptions}
                selectedValue={selectedLang}
                onChange={(optionLang) => {
                    setSelectedLang(optionLang)
                    changeLanguage(optionLang)
                }}
            />

        </ScrollView>
    )


}