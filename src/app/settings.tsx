import { AppIcon } from "@/components/AppIcon"
import GRedir from "@/components/grouped-list-components/GroupedRedirect"
import GroupView from "@/components/grouped-list-components/GroupView"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useDatabaseReset } from "@/database/useDatabaseReset"
import i18n from "@/i18n"
import { BudgetTileMode, useBudgetStore } from "@/stores/useBudgetStore"
import { SCOption } from "@/types/components"
import { ThemePreference } from "@/types/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text } from "react-native"

export default function SettingsScreen() {

    const {t} = useTranslation()

    const router = useRouter()
    const {theme, layout, preference, setPreference} = useStyle()
    const headerHeight = useHeaderHeight()

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

    const budgetTileModeOptions: SCOption<BudgetTileMode>[] = [
        {label: t("settings.budgetTileMode.expensesVsBudget"), value: "expensesVsBudget"},
        {label: t("settings.budgetTileMode.estimatedBalance"), value: "estimatedBalance"},
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

    const {
        resetDatabaseDB,
        resetTransactionsDB,
        resetRecurringTransactionsDB,
        resetRecurringTransactionsCascadeDB,
        resetCreditCardsDB,
        resetBudgetsDB
    } = useDatabaseReset()

    return(
        <ScrollView
            contentContainerStyle={{
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: 120,
                gap: layout.margin.sectionGap,
            }}
        >

            <Text style={[{color: theme.text.label}, FontStyles.title2]}> Debug </Text>

            <GroupView>
                <GRedir
                    separator={"translucent"}
                    leadingIcon={
                        <AppIcon
                            name={"hammer.fill"}
                            androidName={"construction"}
                            size={29}
                            tintColor={theme.text.label}                        
                        />
                    }
                    leadingLabel={"Teste 1"}
                    onPress={() => {router.push("/experiment")}}
                />
                <GRedir
                    separator={"none"}
                    leadingIcon={
                        <AppIcon
                            name={"hammer.fill"}
                            androidName={"construction"}
                            size={29}
                            tintColor={theme.text.label}                        
                        />
                    }
                    leadingLabel={"Teste 2"}
                    onPress={() => {router.push("/experiment2")}}
                />
            </GroupView>

            <GroupView>
                <GRedir
                    separator="translucent"
                    leadingIcon={
                        <AppIcon
                            name={"lines.measurement.horizontal"}
                            androidName={"straighten"}
                            size={29}
                            tintColor={theme.text.label}                        
                        />
                    }
                    leadingLabel="Medir componentes"
                    onPress={() => { router.push("/measures") }}
                />
                <GRedir
                    separator="translucent"
                    leadingIcon={
                        <AppIcon
                            name={"plus.circle"}
                            androidName={"add"}
                            size={29}
                            tintColor={theme.text.label}                        
                        />
                    }
                    leadingLabel="Modal adicionar"
                    onPress={() => { router.push("/modalAdd") }}
                />
                <GRedir
                    separator="translucent"
                    icon="sync-outline"
                    leadingLabel="Modal recorrência"
                    onPress={() => { router.push("/modalRecurring") }}
                />
                <GRedir
                    separator="none"
                    icon="list-outline"
                    leadingLabel="Modal categorias"
                    onPress={() => { router.push("/modalCategoryPicker") }}
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
                    icon="trash-outline"
                    label="Resetar Banco de Dados"
                    onPress={resetDatabaseDB}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações"
                    onPress={resetTransactionsDB}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações Recorrentes"
                    onPress={resetRecurringTransactionsDB}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Transações Recorrentes em Cascata"
                    onPress={resetRecurringTransactionsCascadeDB}
                />
                <GRedir
                    separator="translucent"
                    icon="trash-outline"
                    label="Resetar Cartões"
                    onPress={resetCreditCardsDB}
                />
                <GRedir
                    separator="none"
                    icon="trash-outline"
                    label="Resetar Orçamentos"
                    onPress={resetBudgetsDB}
                />
            </GroupView>

            <Text style={[{color: theme.text.label}, FontStyles.headline]}> ESTADO DO APP </Text>

            <Text style={[{color: theme.text.secondaryLabel}, FontStyles.subhead]}>
                {t("settings.budgetTileMode.title", { defaultValue: "Budget tile display" })}
            </Text>

            <SegmentedControlCompact
                options={budgetTileModeOptions}
                selectedValue={effectiveBudgetTileMode}
                onChange={(value) => {
                    if (!hasBudget) {
                        return
                    }
                    setBudgetTileMode(value)
                }}
                disabledOptions={hasBudget ? [] : budgetTileModeOptions.map((option) => option.value)}
            />

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