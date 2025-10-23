import { NewTransactionProvider } from "@/context/NewTransactionContext"
import { SearchFiltersProvider } from "@/context/SearchFiltersContext"
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
    const {theme, preference} = useTheme()

    const { getSummaryFromDB, createAndSyncRecurringTransactions } = useTransactionDatabase();
    const {loadData, refreshKey} = useSummaryStore();

    useEffect(() => {
        // Dispara o carregamento dos dados do sumário assim que o app é montado
        console.log("Atualizando transações pendentes")
        createAndSyncRecurringTransactions()
    }, [])

    useEffect(() => {
        // Dispara o carregamento dos dados do sumário assim que o app é montado
        console.log("Layout: Carregando sumário na inicialização...");
        loadData({ getSummaryFromDB });
    }, [refreshKey])

    return(
        <NewTransactionProvider>
            <NavigationThemeProvider value={theme.navigationTheme}>
                <SafeAreaProvider>
                    <StatusBar style={preference === 'dark' ? 'light' : preference === 'light' ? 'dark' : 'auto'}/>
                    <Stack 
                        screenOptions={{
                            headerTitleAlign: "center",
                            headerShadowVisible: false,
                            headerTransparent: true,
                            headerTitleStyle: { fontSize: 18, fontWeight: "600", color: theme.colors.white }
                        }}
                    >
                        {/* Tabs */}
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                            }}
                        />
                        {/* Configurações */}
                        <Stack.Screen
                            name="settings"
                            options={{
                                title: t("nav.settings"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: "Start",
                                headerStyle: { backgroundColor: theme.colors.blue }
                            }}
                        />
                        {/* Telas de planejamento */}
                        <Stack.Screen
                            name="recurring"
                            options={{
                                title: t("nav.planning.recurring"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                                headerStyle: { backgroundColor: theme.colors.blue }
                            }}
                        />
                        {/* Modais */}
                        <Stack.Screen
                            name="modalAdd"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                title: t("nav.newTransaction"),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg
                                }
                            }}
                        />
                        <Stack.Screen
                            name="modalRecurring"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                title: t("nav.recurring"),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg,
                                }
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
                        {/* Telas de teste */}
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
        <SearchFiltersProvider>
        <SQLiteProvider databaseName={"sf-app.db"} onInit={initializeDatabase}>
            <ThemeProvider>
                <RootLayoutNav />
            </ThemeProvider>
        </SQLiteProvider>
        </SearchFiltersProvider>
    )
}