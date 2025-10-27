import BottomButton from "@/components/buttons/BottomButton"
import CancelSaveButtons from "@/components/buttons/CancelSaveCombo"
import DeleteButton from "@/components/buttons/DestructiveButton"
import GroupView from "@/components/grouped-list-components/GroupView"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { SCOption } from "@/types/components"
import { BudgetPeriod } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const allowedPeriods: BudgetPeriod[] = ["weekly", "biweekly", "monthly"]

export default function BudgetScreen() {
    const headerHeight = useHeaderHeight()
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const insets = useSafeAreaInsets()

    const { getSummaryFromDB } = useTransactionDatabase()

    const loadSummaryData = useSummaryStore((state) => state.loadData)
    const triggerRefresh = useSummaryStore.getState().triggerRefresh

    const storedBudget = useBudgetStore((state) => state.budget)
    const setBudget = useBudgetStore((state) => state.setBudget)
    const clearBudget = useBudgetStore((state) => state.clearBudget)

    const [period, setPeriod] = useState<BudgetPeriod>(storedBudget?.period ?? "monthly")
    const [amountCents, setAmountCents] = useState<number>(storedBudget?.amountCents ?? 0)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        setPeriod(storedBudget?.period ?? "monthly")
        setAmountCents(storedBudget?.amountCents ?? 0)
    }, [storedBudget])

    const frequencyOptions: SCOption<string>[] = useMemo(
        () => [
            { label: t("budget.form.weekly"), value: "weekly" },
            { label: t("budget.form.biweekly"), value: "biweekly" },
            { label: t("budget.form.monthly"), value: "monthly" },
        ],
        [t]
    )

    const hasChanges = useMemo(() => {
        return (
            period !== (storedBudget?.period ?? "monthly") ||
            amountCents !== (storedBudget?.amountCents ?? 0)
        )
    }, [amountCents, period, storedBudget])

    const canSave = amountCents > 0 && hasChanges && !submitting

    const handleCancel = useCallback(() => {
        setPeriod(storedBudget?.period ?? "monthly")
        setAmountCents(storedBudget?.amountCents ?? 0)
        setFormError(null)
    }, [storedBudget])

    const refreshSummary = useCallback(async () => {
        await loadSummaryData({ getSummaryFromDB })
        triggerRefresh()
    }, [getSummaryFromDB, loadSummaryData, triggerRefresh])

    const handleSave = useCallback(async () => {
        if (!allowedPeriods.includes(period)) {
            setFormError(t("budget.form.errors.period"))
            return
        }

        if (amountCents <= 0) {
            setFormError(t("budget.form.errors.amount"))
            return
        }

        setSubmitting(true)
        setFormError(null)

        try {
            setBudget({ period, amountCents })
            await refreshSummary()
        } catch (error) {
            console.error("Failed to save budget", error)
            setFormError(t("budget.form.saveError"))
        } finally {
            setSubmitting(false)
        }
    }, [amountCents, period, refreshSummary, setBudget, t])

    const handleRemove = useCallback(() => {
        Alert.alert(
            t("budget.form.confirmRemoveTitle"),
            t("budget.form.confirmRemoveMessage"),
            [
                { text: t("buttons.cancel"), style: "cancel" },
                {
                    text: t("budget.form.confirmRemoveConfirm"),
                    style: "destructive",
                    onPress: async () => {
                        setSubmitting(true)
                        setFormError(null)
                        try {
                            clearBudget()
                            await refreshSummary()
                            setPeriod("monthly")
                            setAmountCents(0)
                        } catch (error) {
                            console.error("Failed to remove budget", error)
                            setFormError(t("budget.form.removeError"))
                        } finally {
                            setSubmitting(false)
                        }
                    },
                },
            ]
        )
    }, [clearBudget, refreshSummary, t])

    return (
        <View
            style={{
                flex: 1,
                paddingTop: headerHeight + 24,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: insets.bottom
            }}
        >
        <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
                paddingBottom: 48,
                gap: 32,
            }}
        >
            <View style={{ gap: 8 }}>
                <Text style={[FontStyles.title2, { color: theme.text.label }]}>{t("budget.form.heading")}</Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>{t("budget.form.description")}</Text>
            </View>

            <View style={{ gap: layout.margin.innerSectionGap }}>
                <Text
                    style={{
                        lineHeight: 22,
                        fontSize: 17,
                        paddingHorizontal: layout.margin.contentArea,
                        color: theme.text.label,
                    }}
                >
                    {t("budget.form.frequency")}
                </Text>
                <SegmentedControlCompact
                    options={frequencyOptions}
                    selectedValue={period}
                    onChange={(value) => setPeriod(value as BudgetPeriod)}
                />
            </View>

            <GroupView>
                <GValueInput
                    separator="none"
                    label={t("budget.form.amountLabel")}
                    acViewKey="budget-amount"
                    onChangeNumValue={(value) => {
                        setAmountCents(value)
                        if (formError) {
                            setFormError(null)
                        }
                    }}
                    flowType="outflow"
                    valueInCents={amountCents}
                    labelFlex={2}
                    fieldFlex={2}
                />
            </GroupView>

            {formError ? (
                <Text style={[FontStyles.footnote, { color: theme.colors.red }]}>{formError}</Text>
            ) : null}

            <CancelSaveButtons
                cancelAction={handleCancel}
                primaryAction={handleSave}
                isPrimaryActive={canSave}
            />

            {storedBudget ? (
                <DeleteButton
                    onPress={handleRemove}
                    label={t("budget.form.removeButton")}
                    disabled={submitting}
                />
            ) : null}
        </ScrollView>

        <BottomButton label={"Editar orçamento"} color={theme.colors.green}/>
        </View>
    )
}
