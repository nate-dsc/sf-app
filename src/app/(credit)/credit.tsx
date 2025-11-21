import { AppIcon } from "@/components/AppIcon"
import CCList from "@/components/credit-card-items/CreditCardList/CreditCardList"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { ScrollView as RNScrollView } from "react-native"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    }).format(value)
}

export default function CreditScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const headerHeight = useHeaderHeight()

    const { getCards } = useTransactionDatabase()
    const [cards, setCards] = useState<CCard[]>([])
    const [selectedCard, setSelectedCard] = useState<CCard | null>(null)
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<RNScrollView | null>(null)
    const wasEmptyRef = useRef(true)

    const loadCards = useCallback(async () => {
        try {
            setLoading(true)
            const result = await getCards()
            setCards(result)
        } catch (error) {
            console.log("Erro ao carregar cartões:", error)
        } finally {
            setLoading(false)
        }
    }, [getCards])

    useEffect(() => {
        loadCards()
    }, [loadCards])

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadCards)
        return unsubscribe
    }, [navigation, loadCards])

    useEffect(() => {
        if (cards.length === 0) {
            setSelectedCard(null)
            return
        }

        setSelectedCard((previous) => {
            if (previous) {
                const updated = cards.find((card) => card.id === previous.id)
                if (updated) {
                    return updated
                }
            }

            return cards[0]
        })
    }, [cards])

    useEffect(() => {
        const wasEmpty = wasEmptyRef.current
        const isEmpty = cards.length === 0

        if (wasEmpty && !isEmpty) {
            scrollRef.current?.scrollTo({ y: 0, animated: false })
        }

        wasEmptyRef.current = isEmpty
    }, [cards])

    const handleNavigateToCard = useCallback((card: CCard) => {
        router.push({
            pathname: "/(credit)/[cardId]",
            params: { cardId: card.id.toString() },
        })
    }, [router])

    const handleSelectCard = useCallback((card: CCard) => {
        setSelectedCard(card)
        handleNavigateToCard(card)
    }, [handleNavigateToCard])

    const handleEditCard = useCallback((card: CCard) => {
        router.push({
            pathname: "/(credit)/editCreditCard",
            params: { cardId: card.id.toString() },
        })
    }, [router])

    const shouldShowInlineLoader = loading && cards.length === 0

    return (
        <ScrollView
            ref={scrollRef}
            contentContainerStyle={{
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: 120,
                gap: layout.margin.sectionGap,
            }}
        >
            <View>
                <Text
                    style={[
                        FontStyles.title3,
                        { color: theme.text.label, paddingHorizontal: layout.margin.contentArea },
                    ]}
                >
                    Ações com cartão de crédito
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    gap: layout.margin.sectionGap,
                }}
            >
                <View style={{ flex: 1 }}>
                    <LinkCard
                        label={t("credit.add", { defaultValue: "Adicionar cartão" })}
                        icon={
                            <AppIcon
                                name={"plus.circle"}
                                androidName={"add-card"}
                                size={40}
                                tintColor={theme.colors.white}
                            />
                        }
                        color={theme.colors.green}
                        onPress={() => router.push("/(credit)/addCreditCard")}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <LinkCard
                        label={t("credit.installmentPurchase", { defaultValue: "Compra parcelada" })}
                        icon={
                            <AppIcon
                                name={"cart.badge.plus"}
                                androidName={"add-shopping-cart"}
                                size={40}
                                tintColor={theme.colors.white}
                            />
                        }
                        color={theme.colors.pink}
                        onPress={() => router.push("/(credit)/modalAddInstallmentPurchase")}
                    />
                </View>
            </View>

            <View>
                <Text
                    style={[
                        FontStyles.title3,
                        { color: theme.text.label, paddingHorizontal: layout.margin.contentArea },
                    ]}
                >
                    Carteira
                </Text>
            </View>
            <View
                style={{
                    position: "relative",
                    minHeight: 200,
                    justifyContent: cards.length === 0 ? "center" : undefined,
                }}
            >
                {cards.length === 0 && !shouldShowInlineLoader ? (
                    <Text style={{ color: theme.text.secondaryLabel }}>
                        {t("credit.noCardsAvailable", { defaultValue: "Nenhum cartão cadastrado" })}
                    </Text>
                ) : null}

                {cards.length > 0 ? (
                    <CCList
                        data={cards}
                        onItemPress={(item) => handleNavigateToCard(item)}
                    />
                ) : null}

                {shouldShowInlineLoader ? (
                    <View
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: theme.background.bg + "cc",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: layout.radius.groupedView,
                            gap: 8,
                        }}
                    >
                        <ActivityIndicator color={theme.colors.blue} size="large" />
                        <Text style={{ color: theme.text.secondaryLabel }}>
                            {t("credit.loadingCards", { defaultValue: "Carregando cartões..." })}
                        </Text>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    )
}
