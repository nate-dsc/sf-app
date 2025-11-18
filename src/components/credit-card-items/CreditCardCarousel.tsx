import { CCard } from "@/types/transaction"
import React from "react"
import { Pressable, ScrollView, View } from "react-native"
import CreditCardView from "./CreditCardView"

type CreditCardCarouselProps = {
    cards: CCard[]
    onSelectCard: (card: CCard) => void
}

export default function CreditCardCarousel({ cards, onSelectCard }: CreditCardCarouselProps) {

    return (
        <ScrollView horizontal contentContainerStyle={{}} showsHorizontalScrollIndicator={false}>
            {cards.map((card, index) => {
                const isLastItem = index === cards.length - 1

                return (
                    <Pressable
                        key={card.id}
                        onPress={() => onSelectCard(card)}
                        style={[
                            {
                                marginRight: 16
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
