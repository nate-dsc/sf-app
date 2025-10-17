import { FontStyles } from "@/components/styles/FontStyles"
import { NewTransactionProvider } from "@/context/NewTransactionContext"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { initializeDatabase } from "@/database/InitializeDatabase"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import "@/i18n"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { SafeAreaProvider } from "react-native-safe-area-context"


function RootLayoutNav() {
    const {t} = useTranslation()
    const theme = useTheme()

    const { getSummaryFromDB } = useTransactionDatabase();
    const {loadData, refreshKey} = useSummaryStore();

    useEffect(() => {
        // Dispara o carregamento dos dados do sumário assim que o app é montado
        console.log("Layout: Carregando sumário na inicialização...");
        loadData({ getSummaryFromDB });
    }, [refreshKey])

    return(
        <NewTransactionProvider>
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
                        <Stack.Screen
                            name="experiment2"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                title: "Experimentation"
                            }}
                        />
                        <Stack.Screen
                            name="measures"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                title: "Medidas"
                            }}
                        />
                    </Stack>
                </SafeAreaProvider>
            </NavigationThemeProvider>
        </NewTransactionProvider>
    )
}

export default function RootLayout()
{
    return(
        <SQLiteProvider databaseName={"sf-app.db"} onInit={initializeDatabase}>
            <ThemeProvider>
                <RootLayoutNav />
            </ThemeProvider>
        </SQLiteProvider>
    )
}