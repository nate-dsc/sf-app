import GRedir from "@/components/grouped-list-components/GroupedRedirect"
import GSwitch from "@/components/grouped-list-components/GroupedSwitch"
import GroupView from "@/components/grouped-list-components/GroupView"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useStyle } from "@/context/StyleContext"
import { useDatabaseReset } from "@/database/useDatabaseReset"
import i18n from "@/i18n"
import { useBudgetStore } from "@/stores/useBudgetStore"
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

    const {budget, budgetTileMode, setBudgetTileMode} = useBudgetStore()

    const hasBudget = !!budget
    const effectiveBudgetTileMode = hasBudget ? budgetTileMode : "estimatedBalance"


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

            <Text style={[{color: theme.text.label}, FontStyles.title2]}> Debug </Text>

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

            <Text style={[{color: theme.text.label}, FontStyles.headline]}>
                {t("settings.database.sectionTitle", { defaultValue: "Banco de dados" })}
            </Text>
            <GroupView>
                <GRedir
                    separator="none"
                    icon="grid-outline"
                    label={t("settings.database.inspectTables", { defaultValue: "Visualizar tabelas" })}
                    onPress={() => {
                        router.push("/settingsDatabase")
                    }}
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
                    label="Resetar Banco de Dados"
                    onPress={() => { useDatabaseReset().resetDatabaseDB() }}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações"
                    onPress={() => { useDatabaseReset().resetTransactionsDB() }}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações Recorrentes"
                    onPress={() => { useDatabaseReset().resetRecurringTransactionsDB() }}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações Recorrentes em Cascata"
                    onPress={() => { useDatabaseReset().resetRecurringTransactionsCascadeDB() }}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Cartões"
                    onPress={() => { useDatabaseReset().resetCreditCardsDB() }}
                />
                <GRedir
                    separator="none"
                    icon="trash-outline"
                    label="Resetar Orçamentos"
                    onPress={() => { useDatabaseReset().resetBudgetsDB() }}
                />
            </GroupView>

            <Text style={[{color: theme.text.label}, FontStyles.headline]}> ESTADO DO APP </Text>

            <Text style={[{color: theme.text.secondaryLabel}, FontStyles.subhead]}>
                {t("settings.budgetTileMode.title", { defaultValue: "Budget tile display" })}
            </Text>

            <GroupView>
                <GSwitch
                    separator="none"
                    label={t(`settings.budgetTileMode.${effectiveBudgetTileMode}`)}
                    value={effectiveBudgetTileMode === "expensesVsBudget"}
                    onValueChange={(value) => {
                        if (!hasBudget) {
                            return
                        }
                        setBudgetTileMode(value ? "expensesVsBudget" : "estimatedBalance")
                    }}
                    disabled={!hasBudget}
                />
            </GroupView>

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