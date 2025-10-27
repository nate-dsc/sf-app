import CancelSaveButtons from "@/components/buttons/CancelSaveCombo"
import DeleteButton from "@/components/buttons/DeleteButton"
import GroupView from "@/components/grouped-list-components/GroupView"
import GPopup from "@/components/grouped-list-components/GroupedPopup"
import GSwitch from "@/components/grouped-list-components/GroupedSwitch"
import GTextInput from "@/components/grouped-list-components/GroupedTextInput"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { SCOption } from "@/types/components"
import { BudgetInput, BudgetOverview, BudgetPeriod } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionSheetIOS, ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const allowedPeriods: BudgetPeriod[] = ["weekly", "monthly", "quarterly", "yearly", "custom"]

type BudgetFormState = {
    name: string
    period: BudgetPeriod
    startDate: string
    endDate: string
    rollover: boolean
    categoryId: string
}

type BudgetFormErrors = Partial<{
    name: string
    amount: string
    period: string
    startDate: string
    endDate: string
    categoryId: string
}>

const initialFormState: BudgetFormState = {
    name: "",
    period: "monthly",
    startDate: "",
    endDate: "",
    rollover: false,
    categoryId: "",
}

const isValidDate = (value: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(value)) {
        return false
    }

    const date = new Date(value)
    return !Number.isNaN(date.getTime())
}

const formatDateForInput = (value: string | null) => {
    if (!value) {
        return ""
    }

    if (value.includes("T")) {
        return value.split("T")[0]
    }

    return value.slice(0, 10)
}

const formatDateForStorage = (value: string) => `${value}T00:00`

export default function BudgetScreen() {
    const headerHeight = useHeaderHeight()
    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()

    const {
        getBudgetsOverview,
        createBudget,
        updateBudget,
        deleteBudget,
        getSummaryFromDB,
    } = useTransactionDatabase()

    const loadSummaryData = useSummaryStore((state) => state.loadData)
    const refreshKey = useSummaryStore((state) => state.refreshKey)
    const triggerRefresh = useSummaryStore.getState().triggerRefresh

    const [budgets, setBudgets] = useState<BudgetOverview[]>([])
    const [loadingBudgets, setLoadingBudgets] = useState(true)
    const [listError, setListError] = useState<string | null>(null)

    const [selectedBudget, setSelectedBudget] = useState<BudgetOverview | null>(null)
    const [formState, setFormState] = useState<BudgetFormState>(initialFormState)
    const [amountCents, setAmountCents] = useState(0)
    const [errors, setErrors] = useState<BudgetFormErrors>({})
    const [formError, setFormError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const currency = useMemo(() => (i18n.language === "pt-BR" ? "BRL" : "USD"), [i18n.language])

    const formatCurrency = useCallback(
        (valueInCents: number) =>
            (valueInCents / 100).toLocaleString(i18n.language, {
                style: "currency",
                currency,
                currencySign: "standard",
            }),
        [currency, i18n.language]
    )

    const periodOptions = useMemo(
        () =>
            allowedPeriods.map((period) => ({
                key: period,
                label: t(`budget.periods.${period}`),
            })),
        [t]
    )

    const periodLabel = useMemo(() => {
        return periodOptions.find((option) => option.key === formState.period)?.label ?? ""
    }, [formState.period, periodOptions])

    const loadBudgets = useCallback(async () => {
        try {
            setLoadingBudgets(true)
            setListError(null)
            const data = await getBudgetsOverview()
            setBudgets(data)
        } catch (error) {
            console.error("Failed to load budgets", error)
            setListError(t("budget.list.error"))
        } finally {
            setLoadingBudgets(false)
        }
    }, [getBudgetsOverview, t])

    useEffect(() => {
        void loadBudgets()
    }, [loadBudgets, refreshKey])

    const clearError = useCallback((key: keyof BudgetFormErrors) => {
        setErrors((prev) => {
            if (!prev[key]) {
                return prev
            }
            const next = { ...prev }
            delete next[key]
            return next
        })
    }, [])

    const handleFieldChange = useCallback(<K extends keyof BudgetFormState>(field: K, value: BudgetFormState[K]) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }))
        if (["name", "period", "startDate", "endDate", "categoryId"].includes(field as string)) {
            clearError(field as keyof BudgetFormErrors)
        }
    }, [clearError])

    const handleSelectBudget = useCallback((budget: BudgetOverview) => {
        setSelectedBudget(budget)
        setFormState({
            name: budget.name,
            period: budget.period,
            startDate: formatDateForInput(budget.startDate),
            endDate: formatDateForInput(budget.endDate),
            rollover: budget.rollover,
            categoryId: budget.categoryId ? String(budget.categoryId) : "",
        })
        setAmountCents(budget.amount)
        setErrors({})
        setFormError(null)
    }, [])

    const handleResetForm = useCallback(() => {
        setSelectedBudget(null)
        setFormState(initialFormState)
        setAmountCents(0)
        setErrors({})
        setFormError(null)
    }, [])

    const handleSelectPeriod = useCallback(() => {
        const options = periodOptions.map((option) => option.label)
        const cancelLabel = t("buttons.cancel")

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title: t("budget.form.selectPeriodTitle"),
                    options: [...options, cancelLabel],
                    cancelButtonIndex: options.length,
                },
                (buttonIndex) => {
                    if (buttonIndex < options.length) {
                        handleFieldChange("period", periodOptions[buttonIndex].key)
                    }
                }
            )
        } else {
            Alert.alert(
                t("budget.form.selectPeriodTitle"),
                undefined,
                [
                    ...periodOptions.map((option) => ({
                        text: option.label,
                        onPress: () => handleFieldChange("period", option.key),
                    })),
                    { text: cancelLabel, style: "cancel" },
                ]
            )
        }
    }, [handleFieldChange, periodOptions, t])

    const validateForm = useCallback((): BudgetFormErrors => {
        const validationErrors: BudgetFormErrors = {}

        if (!formState.name.trim()) {
            validationErrors.name = t("budget.form.errors.name")
        }

        if (amountCents <= 0) {
            validationErrors.amount = t("budget.form.errors.amount")
        }

        if (!allowedPeriods.includes(formState.period)) {
            validationErrors.period = t("budget.form.errors.period")
        }

        if (!formState.startDate || !isValidDate(formState.startDate)) {
            validationErrors.startDate = t("budget.form.errors.startDate")
        }

        if (formState.endDate && !isValidDate(formState.endDate)) {
            validationErrors.endDate = t("budget.form.errors.endDate")
        }

        if (formState.categoryId) {
            const parsed = Number(formState.categoryId)
            if (Number.isNaN(parsed)) {
                validationErrors.categoryId = t("budget.form.errors.categoryId")
            }
        }

        setErrors(validationErrors)
        return validationErrors
    }, [amountCents, formState, t])

    const handleSubmit = useCallback(async () => {
        setFormError(null)
        const validation = validateForm()

        if (Object.keys(validation).length > 0) {
            return
        }

        const payload: BudgetInput = {
            name: formState.name.trim(),
            period: formState.period,
            amount: amountCents,
            start_date: formatDateForStorage(formState.startDate),
            end_date: formState.endDate ? formatDateForStorage(formState.endDate) : null,
            rollover: formState.rollover,
            category_id: formState.categoryId ? Number(formState.categoryId) : null,
        }

        try {
            setSubmitting(true)
            if (selectedBudget) {
                await updateBudget(selectedBudget.id, payload)
            } else {
                await createBudget(payload)
            }

            await loadBudgets()
            await loadSummaryData({ getSummaryFromDB })
            triggerRefresh()
            handleResetForm()
        } catch (error) {
            console.error("Failed to save budget", error)
            setFormError(t("budget.form.saveError"))
        } finally {
            setSubmitting(false)
        }
    }, [amountCents, createBudget, formState, getSummaryFromDB, handleResetForm, loadBudgets, loadSummaryData, selectedBudget, t, triggerRefresh, updateBudget, validateForm])

    const handleDelete = useCallback(() => {
        if (!selectedBudget) {
            return
        }

        Alert.alert(
            t("budget.form.confirmDeleteTitle"),
            t("budget.form.confirmDeleteMessage"),
            [
                { text: t("buttons.cancel"), style: "cancel" },
                {
                    text: t("budget.form.confirmDeleteConfirm"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setSubmitting(true)
                            await deleteBudget(selectedBudget.id)
                            await loadBudgets()
                            await loadSummaryData({ getSummaryFromDB })
                            triggerRefresh()
                            handleResetForm()
                        } catch (error) {
                            console.error("Failed to delete budget", error)
                            setFormError(t("budget.form.deleteError"))
                        } finally {
                            setSubmitting(false)
                        }
                    },
                },
            ]
        )
    }, [deleteBudget, getSummaryFromDB, handleResetForm, loadBudgets, loadSummaryData, selectedBudget, t, triggerRefresh])

    const hasRequiredFields =
        formState.name.trim().length > 0 &&
        amountCents > 0 &&
        allowedPeriods.includes(formState.period) &&
        !!formState.startDate &&
        isValidDate(formState.startDate)

    const frequencyOptions: SCOption<string>[] = [
        {label: t("budget.form.weekly"), value: "weekly"},
        {label: t("budget.form.biweekly"), value: "biweekly"},
        {label: t("budget.form.monthly"), value: "monthly"}
    ]

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: headerHeight + 24,
                paddingBottom: 48,
                paddingHorizontal: layout.margin.contentArea,
                gap: 32,
            }}
        >
            <View
                style={{
                    gap: layout.margin.innerSectionGap
                }}
            >
                <Text
                    style={{
                        lineHeight: 22,
                        fontSize: 17,
                        paddingHorizontal: layout.margin.contentArea
                    }}
                >
                    {t("budget.form.frequency")}
                </Text>
                <SegmentedControlCompact
                    options={frequencyOptions}
                    selectedValue={"monthly"}
                    onChange={() => {}}
                />
                <GroupView>
                    <GValueInput
                        separator={"none"}
                        label={t("budget.form.amountLabel")}
                        acViewKey={"bgt"}
                        onChangeNumValue={() => {}}
                        flowType={"inflow"}
                        labelFlex={2}
                        fieldFlex={2}
                    />
                </GroupView>
                <CancelSaveButtons 
                    cancelAction={() => {}} 
                    primaryAction={() => {}} 
                    isPrimaryActive={false}                
                />
            </View>

            <View style={{ gap: 12 }}>
                <Text style={[FontStyles.title2, { color: theme.text.label }]}>{t("budget.list.title")}</Text>
                {loadingBudgets ? (
                    <ActivityIndicator />
                ) : budgets.length === 0 ? (
                    <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>{t("budget.list.empty")}</Text>
                ) : (
                    <GroupView>
                        {budgets.map((budget, index) => {
                            const isLast = index === budgets.length - 1
                            const isSelected = selectedBudget?.id === budget.id
                            const percent = Math.max(0, Math.min(budget.progress * 100, 999))
                            const percentLabel = `${percent.toFixed(percent >= 100 || percent === 0 ? 0 : 1)}%`
                            const overLimit = budget.amount > 0 && budget.spent > budget.amount
                            const spentColor = overLimit ? theme.colors.red : theme.text.label
                            const displaySpent = `${formatCurrency(budget.spent)} / ${formatCurrency(budget.amount)}`
                            const periodText = t(`budget.periods.${budget.period}`)

                            return (
                                <TouchableOpacity
                                    key={budget.id}
                                    onPress={() => handleSelectBudget(budget)}
                                    activeOpacity={0.8}
                                    style={{
                                        paddingVertical: 16,
                                        gap: 8,
                                        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                                        borderBottomColor: theme.separator.translucent,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text
                                            style={[
                                                FontStyles.body,
                                                {
                                                    color: theme.text.label,
                                                    fontWeight: isSelected ? "600" : "500",
                                                },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {budget.name}
                                        </Text>
                                        <Text style={[FontStyles.numSubhead, { color: spentColor }]}>{displaySpent}</Text>
                                    </View>
                                    <View
                                        style={{
                                            height: 4,
                                            borderRadius: 4,
                                            backgroundColor: theme.background.tertiaryBg,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: `${Math.min(Math.max(percent, 0), 100)}%`,
                                                height: "100%",
                                                backgroundColor: overLimit ? theme.colors.red : theme.colors.yellow,
                                            }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={[FontStyles.footnote, { color: theme.text.secondaryLabel }]}>{periodText}</Text>
                                        <Text style={[FontStyles.footnote, { color: theme.text.secondaryLabel }]}>{percentLabel}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </GroupView>
                )}
                {listError ? (
                    <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{listError}</Text>
                ) : null}
            </View>

            <View style={{ gap: 16 }}>
                <Text style={[FontStyles.title2, { color: theme.text.label }]}>
                    {selectedBudget ? t("budget.form.editTitle") : t("budget.form.createTitle")}
                </Text>
                <GroupView style={{ paddingHorizontal: layout.margin.contentArea }}>
                    <GTextInput
                        label={t("budget.form.nameLabel")}
                        acViewKey="budget-name"
                        separator="translucent"
                        value={formState.name}
                        onChangeText={(text) => handleFieldChange("name", text)}
                        autoCapitalize="sentences"
                    />
                    {errors.name ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.name}</Text>
                        </View>
                    ) : null}

                    <GValueInput
                        label={t("budget.form.amountLabel")}
                        acViewKey="budget-amount"
                        separator="translucent"
                        flowType="inflow"
                        onChangeNumValue={(value) => {
                            setAmountCents(value)
                            clearError("amount")
                        }}
                        valueInCents={amountCents}
                    />
                    {errors.amount ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.amount}</Text>
                        </View>
                    ) : null}

                    <GPopup
                        label={t("budget.form.periodLabel")}
                        separator="translucent"
                        displayValue={periodLabel}
                        onPress={handleSelectPeriod}
                    />
                    {errors.period ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.period}</Text>
                        </View>
                    ) : null}

                    <GTextInput
                        label={t("budget.form.startDateLabel")}
                        acViewKey="budget-start-date"
                        separator="translucent"
                        value={formState.startDate}
                        onChangeText={(text) => handleFieldChange("startDate", text)}
                        placeholder="YYYY-MM-DD"
                        autoCapitalize="none"
                    />
                    {errors.startDate ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.startDate}</Text>
                        </View>
                    ) : null}

                    <GTextInput
                        label={t("budget.form.endDateLabel")}
                        acViewKey="budget-end-date"
                        separator="translucent"
                        value={formState.endDate}
                        onChangeText={(text) => handleFieldChange("endDate", text)}
                        placeholder="YYYY-MM-DD"
                        autoCapitalize="none"
                    />
                    {errors.endDate ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.endDate}</Text>
                        </View>
                    ) : null}

                    <GTextInput
                        label={t("budget.form.categoryLabel")}
                        acViewKey="budget-category"
                        separator="translucent"
                        value={formState.categoryId}
                        onChangeText={(text) => handleFieldChange("categoryId", text)}
                        placeholder={t("budget.form.categoryPlaceholder")}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                    />
                    {errors.categoryId ? (
                        <View style={{ paddingVertical: 6 }}>
                            <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{errors.categoryId}</Text>
                        </View>
                    ) : null}

                    <GSwitch
                        label={t("budget.form.rolloverLabel")}
                        separator="none"
                        value={formState.rollover}
                        onValueChange={(value) => handleFieldChange("rollover", value)}
                    />
                </GroupView>

                {formError ? (
                    <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{formError}</Text>
                ) : null}

                <CancelSaveButtons
                    cancelAction={handleResetForm}
                    primaryAction={handleSubmit}
                    isPrimaryActive={hasRequiredFields && !submitting}
                />

                {selectedBudget ? (
                    <DeleteButton
                        onPress={handleDelete}
                        label={t("budget.form.deleteButton")}
                        disabled={submitting}
                        styles={{ alignSelf: "flex-start", marginTop: 8 }}
                    />
                ) : null}
            </View>
        </ScrollView>
    )
}
