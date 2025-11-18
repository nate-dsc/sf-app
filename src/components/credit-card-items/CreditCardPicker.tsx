import React from "react"
import { Pressable, ScrollView, View } from "react-native"

import { useStyle } from "@/context/StyleContext"
import { CCard } from "@/types/transaction"
import CreditCardView from "./CreditCardView"

type CreditCardPickerProps = {
    cards: CCard[]
    selectedCard?: CCard | null
    onSelectCard?: (card: CCard) => void
    onEditCard?: (card: CCard) => void
}

export default function CreditCardPicker({ cards, selectedCard, onSelectCard, onEditCard }: CreditCardPickerProps) {
    const { theme } = useStyle()

    const handleSelectCard = (card: CCard) => {
        if (onSelectCard && card.id !== selectedCard?.id) {
            onSelectCard(card)
        }
    }

    return (
        <ScrollView horizontal contentContainerStyle={{}} showsHorizontalScrollIndicator={false}>
            {cards.map((card, index) => {
                const isSelected = selectedCard?.id === card.id
                const isLastItem = index === cards.length - 1

                return (
                    <Pressable
                        key={card.id}
                        onPress={() => handleSelectCard(card)}
                        onLongPress={onEditCard ? () => onEditCard(card) : undefined}
                        android_ripple={onEditCard ? { color: theme.colors.blue, borderless: false } : undefined}
                        style={[
                            {
                                marginRight: 16,
                                borderRadius: 20,
                                padding: 2,
                                borderWidth: 2,
                                borderColor: "transparent",
                                borderCurve: "continuous",
                            },
                            isSelected && {
                                borderWidth: 2,
                                borderColor: theme.colors.blue,
                            },
                            isLastItem && { marginRight: 0 },
                        ]}
                    >
                        <View pointerEvents="none">
                            <CreditCardView color={card.color} name={card.name} />
                        </View>
                    </Pressable>
                )
            })}
        </ScrollView>
    )
}
