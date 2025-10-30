import { AppIcon } from "@/components/AppIcon"
import CreditCardCarousel from "@/components/credit-card-items/CreditCardCarousel"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"

export default function CreditScreen() {
    const router = useRouter()
    const { theme, layout } = useStyle()
    const { t } = useTranslation()

    const { getCards } = useTransactionDatabase()
    const [cards, setCards] = useState<CCard[]>([])
    const [selectedCard, setSelectedCard] = useState<CCard | null>(null)
    const [loading, setLoading] = useState(true)

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

    useFocusEffect(
        useCallback(() => {
            loadCards()
        }, [loadCards])
    )

    useFocusEffect(
        useCallback(() => {
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
    )

    const handleNavigateToCard = (card: CCard) => {
        setSelectedCard(card)
        router.push({
            pathname: "/(credit)/[cardId]",
            params: { cardId: card.id.toString() },
        })
    }

    const handleEditCard = useCallback((card: CCard) => {
        router.push({
            pathname: "/(credit)/editCreditCard",
            params: { cardId: card.id.toString() },
        })
    }, [router])

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
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
                    Recorrentes
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
                {loading ? (
                    <Text style={{ color: theme.text.secondaryLabel }}>
                        {t("credit.loadingCards", { defaultValue: "Carregando cartões..." })}
                    </Text>
                ) : cards.length === 0 ? (
                    <Text style={{ color: theme.text.secondaryLabel }}>
                        {t("credit.noCardsAvailable", { defaultValue: "Nenhum cartão cadastrado" })}
                    </Text>
                ) : (
                    <CreditCardCarousel
                        cards={cards}
                        selectedCard={selectedCard}
                        onSelectCard={handleNavigateToCard}
                        onEditCard={handleEditCard}
                    />
                )}
            </View>
        </ScrollView>
    )
}
