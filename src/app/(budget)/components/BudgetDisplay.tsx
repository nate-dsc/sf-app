import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { BudgetPeriod } from "@/types/transaction"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

type BudgetDisplayProps = {
    budget: {
        period: BudgetPeriod
        amountCents: number
    } | null
}

const periodDefaults = {
    weekly: "Weekly",
    biweekly: "Every two weeks",
    monthly: "Monthly",
} as const

export function BudgetDisplay({ budget }: BudgetDisplayProps) {
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
                gap: 24,
                padding: layout.margin.contentArea,
                borderRadius: layout.radius.groupedView,
                backgroundColor: theme.fill.secondary,
            }}
        >
            <View style={{ gap: 4 }}>
                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                    {t("budget.form.amountLabel")}
                </Text>
                <Text style={[FontStyles.title1, { color: theme.text.label }]}>{formattedAmount}</Text>
            </View>

            <View style={{ gap: 4 }}>
                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                    {t("budget.form.frequency")}
                </Text>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{periodLabel}</Text>
            </View>
        </View>
    )
}

export default BudgetDisplay
