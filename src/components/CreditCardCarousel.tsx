import React from "react"
import { Pressable, ScrollView, StyleSheet, View } from "react-native"

import CreditCardView from "./credit-card-items/CreditCardView"
import { CCard } from "@/types/transaction"

type CreditCardCarouselProps = {
  cards: CCard[]
  selectedCard?: CCard | null
  onSelectCard?: (card: CCard) => void
}

export default function CreditCardCarousel({
  cards,
  selectedCard,
  onSelectCard,
}: CreditCardCarouselProps) {
  const handleSelectCard = (card: CCard) => {
    if (onSelectCard) {
      onSelectCard(card)
    }
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scrollContent}
      showsHorizontalScrollIndicator={false}
    >
      {cards.map((card, index) => {
        const isSelected = selectedCard?.id === card.id
        const isLastItem = index === cards.length - 1

        return (
          <Pressable
            key={card.id}
            onPress={() => handleSelectCard(card)}
            style={[
              styles.cardWrapper,
              isSelected && styles.selectedCard,
              isLastItem && styles.lastItem,
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginRight: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  lastItem: {
    marginRight: 0,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
})
