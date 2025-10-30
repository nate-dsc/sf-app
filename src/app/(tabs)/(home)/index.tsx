import BudgetTile from "@/components/home-screen-items/BudgetTile"
import DistributionTile from "@/components/home-screen-items/DistributionTile"
import InflowTile from "@/components/home-screen-items/InflowTile"
import LastTransactionTile from "@/components/home-screen-items/LastTransactionTile"
import OutflowTile from "@/components/home-screen-items/OutflowTile"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {

    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()
    const { recurringCreditWarning, clearRecurringCreditWarning } = useNewTransaction()

    const showRecurringWarning = recurringCreditWarning?.reason === "INSUFFICIENT_CREDIT_LIMIT"
    const attemptedAmount = recurringCreditWarning ? recurringCreditWarning.attemptedAmount / 100 : 0
    const availableAmount = recurringCreditWarning ? recurringCreditWarning.availableLimit / 100 : 0

    const formattedAttemptedAmount = showRecurringWarning
        ? new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(attemptedAmount)
        : ""

    const formattedAvailableAmount = showRecurringWarning
        ? new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(availableAmount)
        : ""

    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 130, paddingTop: 10}}
        >
            {showRecurringWarning ? (
                <View
                    style={{
                        padding: 16,
                        borderRadius: layout.radius.groupedView,
                        backgroundColor: theme.background.group.secondaryBg,
                        borderWidth: 1,
                        borderColor: theme.colors.red,
                        gap: 8,
                    }}
                >
                    <Text style={{ color: theme.colors.red, fontSize: 15, fontWeight: "600" }}>
                        {t("notifications.recurringCreditSkipped.title", { defaultValue: "Cobrança não lançada" })}
                    </Text>
                    <Text style={{ color: theme.text.label, fontSize: 13, lineHeight: 18 }}>
                        {t("notifications.recurringCreditSkipped.description", {
                            defaultValue: "Não foi possível lançar {{amount}} no cartão {{card}}. Limite disponível: {{available}}.",
                            amount: formattedAttemptedAmount,
                            available: formattedAvailableAmount,
                            card: recurringCreditWarning?.cardName ?? t("notifications.recurringCreditSkipped.unknownCard", { defaultValue: "selecionado" }),
                        })}
                    </Text>
                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={clearRecurringCreditWarning}
                        style={{ alignSelf: "flex-start" }}
                    >
                        <Text style={{ color: theme.colors.red, fontSize: 13, fontWeight: "600" }}>
                            {t("notifications.recurringCreditSkipped.dismiss", { defaultValue: "Entendi" })}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
            <BudgetTile />

            <InflowTile />
            
            <OutflowTile />

            <LastTransactionTile />

            <DistributionTile />
        </ScrollView>
    )
}