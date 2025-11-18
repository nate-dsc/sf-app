import { useStyle } from "@/context/StyleContext"
import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const { cardId } = useLocalSearchParams<{ cardId?: string }>()


    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={{color: theme.text.label}}>
                {cardId}
            </Text>
        </View>
    )
}

