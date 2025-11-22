import { AppIcon } from "@/components/AppIcon"
import { HeaderConfigProvider, getHeaderScreenOptions, resolveHeaderConfig } from "@/context/HeaderConfigContext"
import { NewTransactionProvider } from "@/context/NewTransactionContext"
import { SearchFiltersProvider } from "@/context/SearchFiltersContext"
import { StyleProvider, useStyle } from "@/context/StyleContext"
import { initializeDatabase } from "@/database/useDatabase"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import "@/i18n"
import { useDistributionStore } from "@/stores/useDistributionStore"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native"
import { Stack, usePathname, useRouter } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TouchableOpacity } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"


function RootLayoutNav() {
    const {t} = useTranslation()
    const {theme, preference} = useStyle()

    const { getSummaryFromDB, getMonthlyCategoryDistribution, createAndSyncRecurringTransactions, createAndSyncInstallments } = useTransactionDatabase();
    const loadSummaryData = useSummaryStore((state) => state.loadData);
    const summaryRefreshKey = useSummaryStore((state) => state.refreshKey);
    const loadDistributionData = useDistributionStore((state) => state.loadData);
    const distributionRefreshKey = useDistributionStore((state) => state.refreshKey);

    const router = useRouter()
    const pathname = usePathname()
    const currentHeaderConfig = useMemo(
        () => resolveHeaderConfig(pathname?.replace(/^\//, "")),
        [pathname],
    )

    useEffect(() => {
        // Dispara o carregamento dos dados do sumário assim que o app é montado
        console.log("Atualizando transações pendentes")

        const syncTransactions = async () => {
            try {
                await Promise.all([
                    createAndSyncRecurringTransactions(),
                    createAndSyncInstallments(),
                ])
            } catch (error) {
                console.error("Falha ao sincronizar transações pendentes", error)
            }
        }

        syncTransactions()
    }, [])

    useEffect(() => {
        // Dispara o carregamento dos dados do sumário assim que o app é montado
        console.log("Layout: Carregando sumário na inicialização...");
        loadSummaryData({ getSummaryFromDB });
        loadDistributionData({ getMonthlyCategoryDistribution });
    }, [distributionRefreshKey, getMonthlyCategoryDistribution, getSummaryFromDB, loadDistributionData, loadSummaryData, summaryRefreshKey])

    //<StatusBar style={preference === 'dark' ? 'light' : preference === 'light' ? 'dark' : 'auto'}/>

    return(
        <NewTransactionProvider>
            <NavigationThemeProvider value={theme.navigationTheme}>
                <SafeAreaProvider>
                    <StatusBar style={'light'}/>
                    <HeaderConfigProvider value={currentHeaderConfig}>
                        <Stack
                            screenOptions={({ route }) => getHeaderScreenOptions(theme, route.name)}
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
                            }}
                        />
                        <Stack.Screen
                            name="settingsDatabase"
                            options={{
                                title: t("settings.database.tablesHeader", { defaultValue: "Tabelas do banco" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                            }}
                        />
                        <Stack.Screen
                            name="settingsDatabaseTable"
                            options={{
                                title: t("settings.database.tableScreenTitle", { defaultValue: "Tabela" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                            }}
                        />
                        {/* Telas de planejamento */}
                        <Stack.Screen
                            name="(recurring)/incomeRecurring"
                            options={{
                                title: t("nav.planning.incomeRecurring"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        <Stack.Screen
                            name="(recurring)/expenseRecurring"
                            options={{
                                title: t("nav.planning.expenseRecurring"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        {/* Telas de orçamento */}
                        <Stack.Screen
                            name="(budget)/budget"
                            options={{
                                title: t("nav.planning.budget", { defaultValue: "Orçamento" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        <Stack.Screen
                            name="(budget)/budgetEdit"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                title: t("nav.planning.budget"),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg
                                }
                            }}
                        />
                        <Stack.Screen
                            name="distribution"
                            options={{
                                title: t("nav.planning.distribution", { defaultValue: "Distribuição" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        <Stack.Screen
                            name="planPurchase"
                            options={{
                                title: t("nav.planning.planPurchase", { defaultValue: "Planejar compra" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        <Stack.Screen
                            name="next12Months"
                            options={{
                                title: t("nav.planning.next12Months", { defaultValue: "Próximos 12 meses" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        <Stack.Screen
                            name="retirement"
                            options={{
                                title: t("nav.planning.retirement", { defaultValue: "Aposentadoria" }),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                            }}
                        />
                        {/* Telas de cartões de crédito */}
                        <Stack.Screen
                            name="(credit)/credit"
                            options={{
                                title: t("nav.credit.index"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.planning.index"),
                                headerRight: () => (
                                    <TouchableOpacity
                                        style={{paddingLeft: 7}}
                                        onPress={() => router.push("/(credit)/creditHelp")}
                                    >
                                        <AppIcon
                                            name={"questionmark"}
                                            androidName={"help-outline"}
                                            size={22}
                                            tintColor={"rgba(255,255,255,0.7)"}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        <Stack.Screen
                            name="(credit)/creditHelp"
                            options={{
                                headerShown: false,
                                presentation: "transparentModal",
                                animation: "fade"
                            }}
                        />
                        <Stack.Screen
                            name="(credit)/[cardId]"
                            options={{
                                title: t("nav.credit.index"),
                                headerBackButtonDisplayMode: "minimal",
                                headerBackButtonMenuEnabled: false,
                                headerBackTitle: t("nav.credit.index"),
                            }}
                        />
                        <Stack.Screen
                            name="(credit)/addCreditCard"
                            options={{
                                title: t("nav.credit.new"),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg
                                }
                            }}
                        />
                        <Stack.Screen
                            name="(credit)/modalAddInstallmentPurchase"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                title: t("nav.credit.installmentPurchase", { defaultValue: "Compra parcelada" }),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="(credit)/cardPurchases"
                            options={{
                                headerBackButtonDisplayMode: "minimal",
                                title: t("credit.purchases.title", { defaultValue: "Compras" }),
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg,
                                },
                            }}
                        />
                        {/* Modais de nova transação*/}
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
                                presentation: "formSheet",
                                contentStyle: {
                                    backgroundColor: theme.background.group.secondaryBg,
                                }
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
                    </HeaderConfigProvider>
                </SafeAreaProvider>
            </NavigationThemeProvider>
        </NewTransactionProvider>
    )
}

export default function RootLayout()
{
    return(
        <SQLiteProvider databaseName={"sf-app.db"} onInit={initializeDatabase}>
            <SearchFiltersProvider>
                <StyleProvider>
                    <RootLayoutNav />
                </StyleProvider>
            </SearchFiltersProvider>
        </SQLiteProvider>
    )
}
