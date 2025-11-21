import React, { useEffect, useMemo, useState } from "react"
import { Pressable, useWindowDimensions, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"

import { useStyle } from "@/context/StyleContext"
import { CCard } from "@/types/transaction"
import CreditCardView from "./CreditCardView"

type CreditCardMenuProps = {
    cards: CCard[]
    selectedCard?: CCard | null
    onSelectCard?: (card: CCard) => void
    onEditCard?: (card: CCard) => void
}

type CarouselItemProps = {
    card: CCard
    isSelected: boolean
    onSelect?: (card: CCard) => void
    onEdit?: (card: CCard) => void
    animationValue: SharedValue<number>
}

function CarouselItem({ card, isSelected, onSelect, onEdit, animationValue }: CarouselItemProps) {
    const { theme } = useStyle()

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    animationValue.value,
                    [-1, 0, 1],
                    [0.92, 1, 0.92],
                    Extrapolate.CLAMP,
                ),
            },
        ],
        opacity: interpolate(animationValue.value, [-1, 0, 1], [0.7, 1, 0.7], Extrapolate.CLAMP),
    }))

    return (
        <Pressable
            onPress={() => onSelect?.(card)}
            onLongPress={onEdit ? () => onEdit(card) : undefined}
            android_ripple={onEdit ? { color: theme.colors.blue, borderless: false } : undefined}
            style={{ paddingHorizontal: 8 }}
        >
            <Animated.View
                style={[
                    {
                        padding: 2,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: isSelected ? theme.colors.blue : "transparent",
                        borderCurve: "continuous",
                    },
                    animatedStyle,
                ]}
            >
                <View pointerEvents="none">
                    <CreditCardView color={card.color} name={card.name} />
                </View>
            </Animated.View>
        </Pressable>
    )
}

export default function CreditCardMenu({ cards, selectedCard, onSelectCard, onEditCard }: CreditCardMenuProps) {
    const { width } = useWindowDimensions()
    const [activeCard, setActiveCard] = useState(selectedCard ?? cards[0] ?? null)

    const carouselWidth = useMemo(() => Math.min(width, 520), [width])
    const itemWidth = carouselWidth - 48

    useEffect(() => {
        if (selectedCard) {
            setActiveCard(selectedCard)
            return
        }

        if (cards.length > 0) {
            setActiveCard(cards[0])
        }
    }, [selectedCard, cards])

    return (
        <Carousel
            width={itemWidth}
            height={200}
            style={{ alignSelf: "center" }}
            data={cards}
            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
            onSnapToItem={(index) => {
                const card = cards[index]
                setActiveCard(card)
            }}
            mode="parallax"
            renderItem={({ item, animationValue }) => (
                <CarouselItem
                    card={item}
                    isSelected={activeCard?.id === item.id || selectedCard?.id === item.id}
                    onSelect={(card) => {
                        setActiveCard(card)
                        onSelectCard?.(card)
                    }}
                    onEdit={onEditCard}
                    animationValue={animationValue}
                />
            )}
        />
    )
}
