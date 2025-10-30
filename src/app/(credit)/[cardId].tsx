import { AppIcon } from "@/components/AppIcon"
import CreditCardView from "@/components/credit-card-items/CreditCardView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard, InstallmentScheduleWithStatus } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useNavigation, useLocalSearchParams, useFocusEffect, useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
    }).format(value)
}

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()
    const navigation = useNavigation()
    const router = useRouter()
    const { cardId } = useLocalSearchParams<{ cardId?: string | string[] }>()
    const { getCard, getCardInstallmentSchedules } = useTransactionDatabase()
    const { warning: recurringCreditWarning, clearNotification: clearRecurringNotification } = useRecurringCreditLimitNotification()

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
    const [schedulesLoading, setSchedulesLoading] = useState(true)
    const [installmentSchedules, setInstallmentSchedules] = useState<InstallmentScheduleWithStatus[]>([])

    useFocusEffect(
        useCallback(() => {
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
        }, [getCard, resolvedCardId])
    )

    useFocusEffect(
        useCallback(() => {
            let isMounted = true

            async function loadSchedules() {
                if (!Number.isFinite(resolvedCardId)) {
                    if (isMounted) {
                        setInstallmentSchedules([])
                        setSchedulesLoading(false)
                    }
                    return
                }

                if (isMounted) {
                    setSchedulesLoading(true)
                }

                try {
                    const data = await getCardInstallmentSchedules(resolvedCardId)
                    if (isMounted) {
                        setInstallmentSchedules(data)
                    }
                } catch (error) {
                    console.error("Erro ao carregar compras parceladas", error)
                    if (isMounted) {
                        setInstallmentSchedules([])
                    }
                } finally {
                    if (isMounted) {
                        setSchedulesLoading(false)
                    }
                }
            }

            loadSchedules()

            return () => {
                isMounted = false
            }
        }, [getCardInstallmentSchedules, resolvedCardId])
    )

    const headerHeight = useHeaderHeight()

    const handleEditCard = useCallback(() => {
        if (!Number.isFinite(resolvedCardId)) {
            return
        }

        router.push({
            pathname: "/(credit)/editCreditCard",
            params: { cardId: resolvedCardId.toString() },
        })
    }, [resolvedCardId, router])

    useFocusEffect(
        useCallback(() => {
            if (!Number.isFinite(resolvedCardId)) {
                navigation.setOptions({ headerRight: undefined })
                return
            }

            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={{ paddingLeft: 7 }} onPress={handleEditCard}>
                        <AppIcon
                            name={"square.and.pencil"}
                            androidName={"edit"}
                            size={22}
                            tintColor={"rgba(255,255,255,0.9)"}
                        />
                    </TouchableOpacity>
                ),
            })

            return () => {
                navigation.setOptions({ headerRight: undefined })
            }
        }, [handleEditCard, navigation, resolvedCardId])
    )

    useFocusEffect(
        useCallback(() => {
            if (card) {
                navigation.setOptions({ title: card.name })
            }
        }, [card, navigation])
    )

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
    const showRecurringWarning = recurringCreditWarning?.reason === "INSUFFICIENT_CREDIT_LIMIT" && recurringCreditWarning.cardId === card.id
    const warningAmount = showRecurringWarning ? recurringCreditWarning.attemptedAmount / 100 : 0
    const warningAvailable = showRecurringWarning ? recurringCreditWarning.availableLimit / 100 : 0

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
        <ScrollView
            contentContainerStyle={{
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: layout.margin.sectionGap * 2,
                gap: layout.margin.sectionGap,
            }}
        >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <CreditCardView color={card.color} name={card.name} />
            </View>

            {showRecurringWarning ? (
                <View
                    style={{
                        backgroundColor: theme.background.group.secondaryBg,
                        borderRadius: layout.radius.groupedView,
                        borderWidth: 1,
                        borderColor: theme.colors.red,
                        padding: layout.spacing.lg,
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
                            card: recurringCreditWarning?.cardName ?? card.name,
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

            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: layout.radius.groupedView,
                    paddingVertical: layout.spacing.lg,
                    paddingHorizontal: layout.spacing.lg,
                    gap: layout.spacing.md,
                }}
            >
                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                    {t("credit.installmentsSection.title", { defaultValue: "Parcelamentos" })}
                </Text>

                {schedulesLoading ? (
                    <View style={{ paddingVertical: layout.spacing.md }}>
                        <ActivityIndicator color={theme.text.secondaryLabel} />
                    </View>
                ) : installmentSchedules.length === 0 ? (
                    <Text style={{ color: theme.text.secondaryLabel }}>
                        {t("credit.installmentsSection.empty", { defaultValue: "Nenhuma compra parcelada registrada para este cartão." })}
                    </Text>
                ) : (
                    installmentSchedules.map((schedule) => {
                        const nextDueLabel = schedule.nextDueDate
                            ? new Intl.DateTimeFormat(i18n.language ?? "pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                              }).format(new Date(`${schedule.nextDueDate}:00Z`))
                            : null

                        const remainingLabel = t("credit.installmentsSection.remaining", {
                            defaultValue: "Restam {{remaining}} de {{total}}",
                            remaining: schedule.remainingCount,
                            total: schedule.installmentsCount,
                        })

                        const formattedInstallment = new Intl.NumberFormat(i18n.language ?? "pt-BR", {
                            style: "currency",
                            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
                        }).format(schedule.installmentValue / 100)

                        return (
                            <View
                                key={schedule.id}
                                style={{
                                    paddingVertical: layout.spacing.sm,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.background.tertiaryBg,
                                    gap: 4,
                                }}
                            >
                                <Text style={[FontStyles.body, { color: theme.text.label, fontWeight: "600" }]}> 
                                    {schedule.description || t("credit.installmentsSection.unnamed", { defaultValue: "Compra parcelada" })}
                                </Text>
                                <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                    {remainingLabel}
                                </Text>
                                <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                    {t("credit.installmentsSection.installmentValue", {
                                        defaultValue: "{{amount}} por parcela",
                                        amount: formattedInstallment,
                                    })}
                                </Text>
                                {nextDueLabel ? (
                                    <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                        {t("credit.installmentsSection.nextDue", {
                                            defaultValue: "Próxima parcela em {{date}}",
                                            date: nextDueLabel,
                                        })}
                                    </Text>
                                ) : null}
                            </View>
                        )
                    })
                )}
            </View>
        </ScrollView>
    )
}
