import GRedir from "@/components/grouped-list-components/GroupedRedirect"
import GroupView from "@/components/grouped-list-components/GroupView"
import { MIStyles } from "@/components/recurrence-modal-items/MenuItemStyles"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useStyle } from "@/context/StyleContext"
import { resetCCDatabase } from "@/database/ResetCCDatabase"
import { resetDatabase } from "@/database/ResetDatabase"
import i18n from "@/i18n"
import { SCOption } from "@/types/components"
import { ThemePreference } from "@/types/theme"
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

            <GroupView>
                <GRedir
                    separator={"translucent"}
                    icon={"hammer"}
                    label={"Teste 1"}
                    onPress={() => {router.push("/experiment")}}
                />
                <GRedir
                    separator={"none"}
                    icon={"hammer"}
                    label={"Teste 2"}
                    onPress={() => {router.push("/experiment2")}}
                />
            </GroupView>

            <GroupView>
                <GRedir
                    separator="translucent"
                    icon="move-outline"
                    label="Medir componentes"
                    onPress={() => { router.push("/measures") }}
                />
                <GRedir
                    separator="translucent"
                    icon="add-outline"
                    label="Modal adicionar"
                    onPress={() => { router.push("/modalAdd") }}
                />
                <GRedir
                    separator="translucent"
                    icon="sync-outline"
                    label="Modal recorrência"
                    onPress={() => { router.push("/modalRecurring") }}
                />
                <GRedir
                    separator="none"
                    icon="list-outline"
                    label="Modal categorias"
                    onPress={() => { router.push("/modalCategoryPicker") }}
                />
            </GroupView>

            <GroupView>
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar banco de dados"
                    onPress={() => { resetDatabase(database) }}
                />
                <GRedir
                    separator="none"
                    icon="trash-outline"
                    label="Resetar cartões"
                    onPress={() => { resetCCDatabase(database) }}
                />
            </GroupView>

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