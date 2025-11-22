import CreditCardForm, { CreditCardFormValues } from "@/components/credit-card-items/CreditCardForm"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/Transactions"
import { getIDfromColor } from "@/utils/CardUtils"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function EditCreditCardModal() {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const router = useRouter()
    const { cardId } = useLocalSearchParams<{ cardId?: string | string[] }>()
    const { getCard, getCards, updateCard } = useTransactionDatabase()

    const resolvedCardId = useMemo(() => {
        if (!cardId) {
            return NaN
        }

        const id = Array.isArray(cardId) ? cardId[0] : cardId
        const parsed = Number(id)

        return Number.isFinite(parsed) ? parsed : NaN
    }, [cardId])

    const [card, setCard] = useState<CCard | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function loadCard() {
            if (!Number.isFinite(resolvedCardId)) {
                if (isMounted) {
                    setCard(null)
                    setLoading(false)
                }
                return
            }

            if (isMounted) {
                setLoading(true)
            }

            try {
                const result = await getCard(resolvedCardId)
                if (isMounted) {
                    setCard(result)
                }
            } catch (error) {
                console.error("Failed to load credit card", error)
                if (isMounted) {
                    setCard(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadCard()

        return () => {
            isMounted = false
        }
    }, [getCard, resolvedCardId])

    const handleValidate = useCallback(async (values: CreditCardFormValues) => {
        if (!card) {
            return null
        }

        const cards = await getCards()
        const normalizedName = values.name.trim().toLowerCase()

        const duplicatedName = cards.some((existingCard) => existingCard.id !== card.id && existingCard.name.trim().toLowerCase() === normalizedName)
        if (duplicatedName) {
            return t("credit.errors.duplicateName", { defaultValue: "Já existe um cartão com este nome." })
        }

        const duplicatedLimit = cards.some((existingCard) => existingCard.id !== card.id && existingCard.maxLimit === values.maxLimit)
        if (duplicatedLimit) {
            return t("credit.errors.duplicateLimit", { defaultValue: "Já existe um cartão com este limite." })
        }

        return null
    }, [card, getCards, t])

    const handleSubmit = useCallback(async (values: CreditCardFormValues) => {
        if (!card) {
            return
        }

        await updateCard(card.id, {
            name: values.name,
            color: getIDfromColor(values.color, theme),
            maxLimit: values.maxLimit,
            closingDay: values.closingDay,
            dueDay: values.dueDay,
            ignoreWeekends: values.ignoreWeekends,
        })

        router.back()
    }, [card, router, theme, updateCard])

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: layout.margin.contentArea,
                    backgroundColor: theme.background.bg,
                    gap: layout.margin.sectionGap,
                }}
            >
                <ActivityIndicator color={theme.colors.blue} size="large" />
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                    {t("credit.loadingCard", { defaultValue: "Carregando cartão" })}
                </Text>
            </View>
        )
    }

    if (!card) {
        return (
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: layout.margin.contentArea,
                    gap: layout.margin.sectionGap,
                    backgroundColor: theme.background.bg,
                }}
            >
                <Text style={[FontStyles.title3, { color: theme.text.label, textAlign: "center" }]}>
                    {t("credit.cardNotFound", { defaultValue: "Cartão não encontrado" })}
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                    {t("credit.cardNotFoundDescription", {
                        defaultValue: "Não foi possível localizar as informações deste cartão.",
                    })}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 100,
                        backgroundColor: theme.fill.secondary,
                    }}
                >
                    <Text style={{ color: theme.text.label, fontSize: 17, fontWeight: "500" }}>
                        {t("buttons.cancel", { defaultValue: "Cancelar" })}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    return (
        <CreditCardForm
            initialValues={{
                name: card.name,
                color: card.color,
                maxLimit: card.maxLimit,
                closingDay: card.closingDay,
                dueDay: card.dueDay,
                ignoreWeekends: card.ignoreWeekends,
            }}
            onCancel={() => router.back()}
            onValidate={handleValidate}
            onSubmit={handleSubmit}
        />
    )
}
