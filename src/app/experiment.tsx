import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import { type SCOption } from "@/components/menu-items/SegmentedControl"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { ThemePreference, useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

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
        <View style={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>
            <View style={{flexDirection: "row", gap: 6}}>
                <View style={[{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: theme.background.groupSecondaryBg,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: theme.background.groupTertiaryBg,
                        borderCurve: "continuous",
                        paddingRight: 22,
                        paddingLeft: 18,
                    }
                ]}>
                    <Ionicons size={20} name="trash-outline" color={theme.colors.red}/>
                    <Text
                        style={[
                            FontStyles.title3,
                            {paddingVertical: 10, color: theme.colors.red}
                        ]}
                    >
                        Delete
                    </Text>
                </View>
                <View style={[{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: theme.background.groupSecondaryBg,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: theme.background.groupTertiaryBg,
                        borderCurve: "continuous",
                        paddingRight: 22,
                        paddingLeft: 18,
                    }
                ]}>
                    <Ionicons size={20} name="arrow-back" color={theme.text.label}/>
                    <Text
                        style={[
                            FontStyles.title3,
                            {paddingVertical: 10, color: theme.text.label}
                        ]}
                    >
                        Return
                    </Text>
                </View>
            </View>
            
            

        </View>
    )


}