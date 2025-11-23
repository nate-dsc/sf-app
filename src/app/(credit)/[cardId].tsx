import GroupView from "@/components/grouped-list-components/GroupView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useDatabase } from "@/database/useDatabase"
import { CCard } from "@/types/CreditCards"
import { useHeaderHeight } from "@react-navigation/elements"
import { useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"


function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    }).format(value)
}

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const headerHeight = useHeaderHeight()
    const { cardId } = useLocalSearchParams<{ cardId?: string }>()
    const { getCard } = useDatabase()
    const [card, setCard] = useState<CCard | null>(null)
    const [loading, setLoading] = useState(true)

    const resolvedCardId = useMemo(() => {
        if (!cardId) {
            return NaN
        }

        const parsed = Number(cardId)
        return Number.isFinite(parsed) ? parsed : NaN
    }, [cardId])

    const loadCard = useCallback(async () => {
        if (!Number.isFinite(resolvedCardId)) {
            setCard(null)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const result = await getCard(resolvedCardId)
            setCard(result)
        } catch (error) {
            console.log("Erro ao carregar cartões:", error)
        } finally {
            setLoading(false)
        }
    }, [getCard, resolvedCardId])

    useEffect(() => {
        loadCard()
    }, [loadCard])

    if (!Number.isFinite(resolvedCardId)) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.background.bg,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: layout.margin.contentArea,
                    gap: 8,
                }}
            >
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                    Não foi possível carregar as informações do cartão.
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                    Verifique o cartão selecionado e tente novamente.
                </Text>
            </View>
        )
    }

    const availableLimit = card ? card.maxLimit - card.limitUsed : 0

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background.bg,
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                gap: layout.margin.sectionGap,
            }}
        >
            <View style={{ gap: 4 }}>
                <Text style={[FontStyles.title1, { color: theme.text.label }]}>
                    {card?.name ?? "Cartão de crédito"}
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>Informações do cartão</Text>
            </View>

            {loading ? (
                <View
                    style={{
                        gap: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: layout.margin.contentArea,
                    }}
                >
                    <ActivityIndicator color={theme.colors.blue} />
                    <Text style={{ color: theme.text.secondaryLabel }}>Carregando cartão...</Text>
                </View>
            ) : null}

            {!loading && !card ? (
                <View style={{ gap: 6 }}>
                    <Text style={[FontStyles.title3, { color: theme.text.label }]}>Cartão não encontrado</Text>
                    <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>Tente novamente mais tarde.</Text>
                </View>
            ) : null}

            {card ? (
                <GroupView>
                    <View style={{ gap: 4 }}>
                        <Text style={[FontStyles.caption1, { color: theme.text.secondaryLabel }]}>Limite disponível</Text>
                        <Text style={[FontStyles.title2, { color: theme.text.label }]}>
                            {formatCurrency(Math.max(availableLimit/100, 0))}
                        </Text>
                    </View>

                    <View
                        style={{
                            borderTopWidth: layout.border.thin,
                            borderColor: theme.separator.translucent,
                            paddingTop: layout.margin.innerSectionGap,
                            gap: layout.margin.innerSectionGap,
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: theme.text.secondaryLabel }}>Limite total</Text>
                            <Text style={[FontStyles.numBody, { color: theme.text.label }]}>
                                {formatCurrency(card.maxLimit/100)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: theme.text.secondaryLabel }}>Utilizado</Text>
                            <Text style={[FontStyles.numBody, { color: theme.text.label }]}>
                                {formatCurrency(card.limitUsed/100)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: theme.text.secondaryLabel }}>Fechamento</Text>
                            <Text style={[FontStyles.numBody, { color: theme.text.label }]}>{card.closingDay}º dia</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: theme.text.secondaryLabel }}>Vencimento</Text>
                            <Text style={[FontStyles.numBody, { color: theme.text.label }]}>{card.dueDay}º dia</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: theme.text.secondaryLabel }}>Ignorar finais de semana</Text>
                            <Text style={[FontStyles.body, { color: theme.text.label }]}>
                                {card.ignoreWeekends ? "Sim" : "Não"}
                            </Text>
                        </View>
                    </View>
                </GroupView>
            ) : null}
        </View>
    )
}

