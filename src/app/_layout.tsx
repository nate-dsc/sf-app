import { FontStyles } from "@/components/styles/FontStyles"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import "@/i18n"
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useTranslation } from "react-i18next"
import { SafeAreaProvider } from "react-native-safe-area-context"

 function RootLayoutNav() {
    const {t} = useTranslation()
    const theme = useTheme()

    return(
        <NavigationThemeProvider value={theme.theme.navigationTheme}>
            <SafeAreaProvider>
                <StatusBar style={theme.preference === 'dark' ? 'light' : theme.preference === 'light' ? 'dark' : 'auto'}/>
                <Stack screenOptions={{
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTitleStyle: FontStyles.title2}}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="settings"
                        options={{
                            title: t("nav.settings"),
                            headerBackButtonDisplayMode: "minimal",
                            headerBackButtonMenuEnabled: false,
                            headerBackTitle: "Start",
                        }}
                    />
                    <Stack.Screen
                        name="modalAdd"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            title: t("nav.newTransaction"),
                            presentation: "formSheet"
                        }}
                    />
                    <Stack.Screen
                        name="modalRecurring"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            headerBackButtonMenuEnabled: false,
                            title: t("nav.recurring"),
                            presentation: "formSheet"
                        }}
                    />
                    <Stack.Screen
                        name="modalCategoryPicker"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            headerBackButtonMenuEnabled: false,
                            title: t("nav.categories"),
                            presentation: "formSheet"
                        }}
                    />
                    <Stack.Screen
                        name="experiment"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            headerBackButtonMenuEnabled: false,
                            title: "Experimentation"
                        }}
                    />
                </Stack>
            </SafeAreaProvider>
        </NavigationThemeProvider>
    )
}

export default function RootLayout()
{
    return(
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    )
}