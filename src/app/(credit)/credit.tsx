import { AppIcon } from "@/components/AppIcon"
import CreditCardCarousel from "@/components/credit-card-items/CreditCardCarousel"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter, useNavigation } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"

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
    const { warning: recurringCreditWarning, clearNotification: clearRecurringNotification } = useRecurringCreditLimitNotification()

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

    const showRecurringWarning = recurringCreditWarning?.reason === "INSUFFICIENT_CREDIT_LIMIT"
    const warningAmount = showRecurringWarning ? recurringCreditWarning.attemptedAmount / 100 : 0
    const warningAvailable = showRecurringWarning ? recurringCreditWarning.availableLimit / 100 : 0

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.background.bg,
                }}
            >
                <ActivityIndicator color={theme.colors.blue} size="large" />
                <Text style={[FontStyles.body, { marginTop: 12, color: theme.text.secondaryLabel }]}> 
                    {t("credit.loadingCards", { defaultValue: "Carregando cartões..." })}
                </Text>
            </View>
        )
    }

    return (
        <ScrollView
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
                    Recorrentes
                </Text>
            </View>
            {showRecurringWarning ? (
                <View
                    style={{
                        marginHorizontal: layout.margin.contentArea,
                        padding: 16,
                        borderRadius: layout.radius.groupedView,
                        backgroundColor: theme.background.group.secondaryBg,
                        borderWidth: 1,
                        borderColor: theme.colors.red,
                        gap: 8,
                    }}
                >
                    <Text style={{ color: theme.colors.red, fontSize: 15, fontWeight: "600" }}>
                        {t("notifications.recurringCreditSkipped.title", { defaultValue: "Cobrança não lançada" })}
                    </Text>
                    <Text style={{ color: theme.text.label, fontSize: 13, lineHeight: 18 }}>
                        {t("notifications.recurringCreditSkipped.description", {
                            defaultValue: "Não foi possível lançar {{amount}} no cartão {{card}}. Limite disponível: {{available}}.",
                            amount: formatCurrency(warningAmount),
                            available: formatCurrency(warningAvailable),
                            card: recurringCreditWarning?.cardName ?? t("notifications.recurringCreditSkipped.unknownCard", { defaultValue: "selecionado" }),
                        })}
                    </Text>
                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={clearRecurringNotification}
                        style={{ alignSelf: "flex-start" }}
                    >
                        <Text style={{ color: theme.colors.red, fontSize: 13, fontWeight: "600" }}>
                            {t("notifications.recurringCreditSkipped.dismiss", { defaultValue: "Entendi" })}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
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
