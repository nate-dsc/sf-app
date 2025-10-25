import { useStyle } from "@/context/StyleContext"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

export default function CardSettingsScreen() {
    const { cardId } = useLocalSearchParams()
    const navigation = useNavigation()
    const { theme } = useStyle()

    const [card, setCard] = useState<{ name: string; color: string } | null>(null)

    useEffect(() => {
        const loadCard = async () => {
        const result = await getCardById(Number(cardId))
        setCard(result)

        // Atualiza o header dinamicamente
        navigation.setOptions({
            title: result?.name ?? "Cartão",
            headerStyle: {
            backgroundColor: result?.color ?? theme.colors.background,
            },
            headerTintColor: theme.colors.text,
        })
        }

        loadCard()
    }, [cardId])

    if (!card) return <Text>Carregando...</Text>

    return (
        <View style={{ flex: 1, padding: 16 }}>
        <Text>Configurações do cartão {card.name}</Text>
        </View>
    )
}
