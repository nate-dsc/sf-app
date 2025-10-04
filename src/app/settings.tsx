import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import Redir from "@/components/menu-items/Redir"
import SegmentedControl, { type SCOption } from "@/components/menu-items/SegmentedControl"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import { strToPreference } from "@/utils/ThemeUtils"
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

    const themeOptions: SCOption[] = [
        {key: "system", value: t("settings.theme.system")},
        {key: "light", value: t("settings.theme.light")},
        {key: "dark", value: t("settings.theme.dark")}
    ]

    const langOptions: SCOption[] = [
        {key: "en-US", value: "English"},
        {key: "pt-BR", value: "Português"}
    ]

    useEffect(() => {setSelectedTheme(preference)}, [preference])

    const changeLanguage = async (lang: string) => {
        await AsyncStorage.setItem("language", lang);
        i18n.changeLanguage(lang);
    }

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>
            <Redir iconName="hammer" text="Tests" onPress={() => {router.push("/experiment")}} />

            {/* <Redir text="No icon!" onPress={() => {setCategory("casa")}} />

            <SRedir text="Selecionar!!" selected={category} onPress={() => {}}/>

            <DatePicker text="Data!!"/>

            <ValueInput leftText="TESTE" />

            <DescriptionInput leftText="teste"/> */}

            <Text style={[{color: menuStyles.text.color}, FontStyles.title2]}> Debug </Text>

            <Text style={[{color: menuStyles.text.color}, FontStyles.headline]}> {t("settings.theme.description")} </Text>

            <SegmentedControl
                options={themeOptions}
                selectedValue={selectedTheme}
                onChange={(optionKey) => {
                    setSelectedTheme(strToPreference(optionKey))
                    setPreference(strToPreference(optionKey))
                }}
            />

            <Text style={[{color: menuStyles.text.color}, FontStyles.headline]}> {t("settings.langDescription")} </Text>

            <SegmentedControl
                options={langOptions}
                selectedValue={selectedLang}
                onChange={(optionKey) => {
                    setSelectedLang(optionKey)
                    changeLanguage(optionKey)
                }}
            />

        </ScrollView>
    )


}