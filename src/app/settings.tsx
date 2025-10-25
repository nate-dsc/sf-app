import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import Redir from "@/components/menu-items/Redir"
import SegmentedControlCompact, { type SCOption } from "@/components/menu-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { ThemePreference, useStyle } from "@/context/StyleContext"
import { resetDatabase } from "@/database/ResetDatabase"
import i18n from "@/i18n"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text } from "react-native"

export default function SettingsScreen() {

    const {t} = useTranslation()

    const router = useRouter()
    const {theme, preference, setPreference} = useStyle()

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

    const database = useSQLiteContext()

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer, {gap: 10}]}>

            <Text style={[menuStyles.text, FontStyles.title2]}> Debug </Text>

            <Redir iconName="hammer" text="Teste 1" onPress={() => {router.push("/experiment")}} />

            <Redir iconName="hammer" text="Teste 2" onPress={() => {router.push("/experiment2")}} />

            <Redir iconName="move-outline" text="MEDIR COMPONENTES" onPress={() => {router.push("/measures")}} />

            <Redir iconName="add-outline" text="MODAL ADICIONAR" onPress={() => {router.push("/modalAdd")}} />

            <Redir iconName="sync-outline" text="MODAL RECORRENCIA" onPress={() => {router.push("/modalRecurring")}} />
            
            <Redir iconName="list-outline" text="MODAL CATEGORIAS" onPress={() => {router.push("/modalCategoryPicker")}} />

            <Redir iconName="trash-outline" text="RESETAR BANCO DE DADOS" onPress={() => {resetDatabase(database)}} />

            <Text style={[{color: menuStyles.text.color}, FontStyles.headline]}> ESTADO DO APP </Text>

            <SegmentedControlCompact
                options={themeOptions}
                selectedValue={selectedTheme}
                onChange={(optionTheme) => {
                    setSelectedTheme(optionTheme)
                    setPreference(optionTheme)
                }}
            />

            <SegmentedControlCompact
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