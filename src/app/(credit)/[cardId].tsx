import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/CreditCards"
import { useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const { cardId } = useLocalSearchParams<{ cardId?: string }>()
    const { getCard } = useTransactionDatabase()
    const [card, setCard] = useState<CCard | null>(null)

    const loadCard = useCallback(async () => {
        try {
            if(cardId) {
                const result = await getCard(Number(cardId))
                setCard(result)
            }
        }catch (error) {
            console.log("Erro ao carregar cartões:", error)
        }
    },[])


    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={{color: theme.text.label}}>
                {card?.maxLimit! - card?.limitUsed!}
            </Text>
        </View>
    )
}

