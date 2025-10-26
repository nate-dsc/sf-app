import BlurredModalView from "@/components/BlurredModalView"
import { useStyle } from "@/context/StyleContext"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Text } from "react-native"

export default function CreditHelpModal() {

    const {t} = useTranslation()
    const {theme, layout} = useStyle()
    const router = useRouter()

    return(
        <BlurredModalView onBackgroundPress={() => router.back()}>
            <Text style={{color: theme.text.label}}>
                {`
                Cartões de crédito\n
                Limite:\n
                Valor máximo de compras não pagas feitas com o cartão de crédito. 
                Se seu limite for insuficiente para uma compra, ela não será registrada.\n
                Data a partir da qual as compras feitas no cartão só serão pagas na próxima fatura.\n
                Dia de vencimento:\n
                Dia em que a fatura deve ser paga. 
                Nesse dia o valor estimado da fatura será automaticamente descontado do seu saldo!\n
                Ignorar fins de semana:\n
                Move o dia de fechamento e vencimento para o próximo dia de semana. 
                Ainda permite que esses dias sejam feriados e não contabilizados pelo seu banco/operadora.
                `}
            </Text>
        </BlurredModalView>
    )    

}