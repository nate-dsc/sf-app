import CreditCardView from "@/components/credit-card-items/CreditCardView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useNavigation, useLocalSearchParams } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    }).format(value)
}

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const navigation = useNavigation()
    const { cardId } = useLocalSearchParams<{ cardId?: string | string[] }>()
    const { getCard } = useTransactionDatabase()

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
                    setLoading(false)
                    setCard(null)
                }
                return
            }

            if (isMounted) {
                setLoading(true)
            }

            try {
                const data = await getCard(resolvedCardId)
                if (isMounted) {
                    setCard(data)
                }
            } catch (error) {
                console.error("Erro ao carregar cartão", error)
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
    }, [resolvedCardId])

    useEffect(() => {
        if (card) {
            navigation.setOptions({ title: card.name })
        }
    }, [card, navigation])

    const headerHeight = useHeaderHeight()

    const contentStyle = {
        paddingTop: headerHeight + layout.margin.contentArea,
        paddingHorizontal: layout.margin.contentArea,
        paddingBottom: layout.margin.sectionGap * 2,
        gap: layout.margin.sectionGap,
    }

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
                    {t("credit.loadingCard", { defaultValue: "Carregando cartão" })}
                </Text>
            </View>
        )
    }

    if (!card) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: layout.margin.contentArea,
                    backgroundColor: theme.background.bg,
                    gap: 12,
                }}
            >
                <Text style={[FontStyles.title3, { color: theme.text.label }]}> 
                    {t("credit.cardNotFound", { defaultValue: "Cartão não encontrado" })}
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                    {t("credit.cardNotFoundDescription", {
                        defaultValue: "Não foi possível localizar as informações deste cartão.",
                    })}
                </Text>
            </View>
        )
    }

    const availableLimit = card.limit - card.limitUsed

    const infoRows = [
        {
            label: t("credit.limit", { defaultValue: "Limite" }),
            value: formatCurrency(card.limit),
        },
        {
            label: t("credit.limitUsed", { defaultValue: "Utilizado" }),
            value: formatCurrency(card.limitUsed),
        },
        {
            label: t("credit.availableLimit", { defaultValue: "Disponível" }),
            value: formatCurrency(availableLimit),
        },
        {
            label: t("credit.closingDay", { defaultValue: "Fechamento" }),
            value: card.closingDay.toString(),
        },
        {
            label: t("credit.dueDay", { defaultValue: "Vencimento" }),
            value: card.dueDay.toString(),
        },
        {
            label: t("credit.ignoreWeekends", { defaultValue: "Ignorar fins de semana" }),
            value: card.ignoreWeekends ? t("common.yes", { defaultValue: "Sim" }) : t("common.no", { defaultValue: "Não" }),
        },
    ]

    return (
        <ScrollView contentContainerStyle={contentStyle}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <CreditCardView color={card.color} name={card.name} />
            </View>

            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: layout.radius.groupedView,
                    paddingVertical: layout.spacing.lg,
                    paddingHorizontal: layout.spacing.lg,
                    gap: layout.spacing.lg,
                }}
            >
                {infoRows.map((row) => (
                    <View key={row.label} style={{ gap: 4 }}>
                        <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>{row.label}</Text>
                        <Text style={[FontStyles.title3, { color: theme.text.label }]}>{row.value}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}
