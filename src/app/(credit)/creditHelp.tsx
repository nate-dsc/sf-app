import BlurredModalView from "@/components/BlurredModalView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

export default function CreditHelpModal() {
    const { t } = useTranslation()
    const { theme, layout } = useStyle()
    const router = useRouter()

    return (
        <BlurredModalView onBackgroundPress={() => router.back()}>
            <View style={{ gap: layout.spacing.md }}>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}> 
                    {t("credit.help.title", { defaultValue: "Cartões de crédito" })}
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, lineHeight: 22 }]}>
                    {t("credit.help.body", {
                        defaultValue:
                            "Limite: valor máximo de compras não pagas feitas com o cartão de crédito. Se seu limite for insuficiente para uma compra, ela não será registrada.\n\nDia de fechamento: data a partir da qual as compras feitas no cartão só serão pagas na próxima fatura.\n\nDia de vencimento: dia em que a fatura deve ser paga. Nesse dia o valor estimado da fatura será automaticamente descontado do seu saldo!\n\nIgnorar fins de semana: move o dia de fechamento e vencimento para o próximo dia útil. Ainda permite que esses dias sejam feriados e não contabilizados pelo seu banco/operadora.",
                    })}
                </Text>
            </View>
        </BlurredModalView>
    )
}
