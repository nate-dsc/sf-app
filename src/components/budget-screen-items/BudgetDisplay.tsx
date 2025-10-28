import { useStyle } from "@/context/StyleContext"
import { StoredBudget } from "@/stores/useBudgetStore"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Text, View, ViewProps } from "react-native"

const periodDefaults = {
    weekly: "Weekly",
    biweekly: "Every two weeks",
    monthly: "Monthly",
} as const

export type BudgetDisplayProps = {
    budget: StoredBudget | null | undefined
} & ViewProps

export default function BudgetDisplay({ budget, style, ...viewProps }: BudgetDisplayProps) {
    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()

    const locale = i18n.language
    const currency = locale === "pt-BR" ? "BRL" : "USD"

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        [currency, locale]
    )

    const formattedAmount = useMemo(() => {
        if (!budget) {
            return null
        }

        return currencyFormatter.format(budget.amountCents / 100)
    }, [budget, currencyFormatter])

    const periodLabel = useMemo(() => {
        if (!budget) {
            return null
        }

        return t(`budget.periods.${budget.period}`, {
            defaultValue: periodDefaults[budget.period],
        })
    }, [budget, t])

    if (!budget) {
        return null
    }

    return (
        <View
            style={{
                gap: 16,
                paddingHorizontal: layout.margin.contentArea,
                paddingVertical: 12,
                borderRadius: 24,
                backgroundColor: theme.background.elevated.bg,
            }}
        >
            <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 15, color: theme.text.secondaryLabel }}>
                    {t("budget.form.amountLabel")}
                </Text>
                <Text style={{ fontVariant: ["tabular-nums"], fontSize: 34, color: theme.text.label }}>
                    {formattedAmount}
                </Text>
            </View>

            <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 15, color: theme.text.secondaryLabel }}>
                    {t("budget.form.frequency")}
                </Text>
                <Text style={{ fontSize: 20, color: theme.text.label }}>
                    {periodLabel}
                </Text>
            </View>
        </View>
    )
}
