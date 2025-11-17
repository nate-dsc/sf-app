import { AppIcon } from "@/components/AppIcon"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import CreditCardView from "@/components/credit-card-items/CreditCardView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { CCard, CardStatementCycleSummary, InstallmentScheduleWithStatus } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, FlatList, ListRenderItem, Text, TouchableOpacity, View } from "react-native"

type StatementStatus = "open" | "closed" | "overdue"

export default function CreditCardDetailsScreen() {
    const { theme, layout } = useStyle()
    const { t, i18n } = useTranslation()
    const navigation = useNavigation()
    const router = useRouter()
    const { cardId } = useLocalSearchParams<{ cardId?: string | string[] }>()
    const { getCard, getCardInstallmentSchedules, getCardStatementForDate, getCardStatementHistory } = useTransactionDatabase()
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
    const [statement, setStatement] = useState<CardStatementCycleSummary | null>(null)
    const [statementLoading, setStatementLoading] = useState(true)
    const [history, setHistory] = useState<CardStatementCycleSummary[]>([])
    const [historyLoading, setHistoryLoading] = useState(true)
    const [historyExpanded, setHistoryExpanded] = useState(false)
    const [schedulesLoading, setSchedulesLoading] = useState(true)
    const [installmentSchedules, setInstallmentSchedules] = useState<InstallmentScheduleWithStatus[]>([])

    const locale = i18n.language ?? "pt-BR"
    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: "currency",
                currency: locale === "pt-BR" ? "BRL" : "USD",
                maximumFractionDigits: 2,
            }),
        [locale],
    )
    const shortDateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "2-digit",
            }),
        [locale],
    )
    const longDateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "long",
            }),
        [locale],
    )
    const monthFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
            }),
        [locale],
    )
    const shortMonthFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                day: "2-digit",
                month: "short",
            }),
        [locale],
    )

    const formatCurrency = useCallback((value: number) => currencyFormatter.format(value), [currencyFormatter])

    useFocusEffect(
        useCallback(() => {
            let isMounted = true

            async function loadPrimaryData() {
                if (!Number.isFinite(resolvedCardId)) {
                    if (isMounted) {
                        setLoading(false)
                        setStatementLoading(false)
                        setHistoryLoading(false)
                        setCard(null)
                        setStatement(null)
                        setHistory([])
                    }
                    return
                }

                if (isMounted) {
                    setLoading(true)
                    setStatementLoading(true)
                    setHistoryLoading(true)
                }

                try {
                    const [cardData, statementData, historyData] = await Promise.all([
                        getCard(resolvedCardId),
                        getCardStatementForDate(resolvedCardId),
                        getCardStatementHistory(resolvedCardId, { months: 24 }),
                    ])

                    if (!isMounted) {
                        return
                    }

                    setCard(cardData)
                    setStatement(statementData)
                    setHistory(historyData)
                    setHistoryExpanded(false)
                } catch (error) {
                    console.error("Erro ao carregar cartão", error)
                    if (isMounted) {
                        setCard(null)
                        setStatement(null)
                        setHistory([])
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false)
                        setStatementLoading(false)
                        setHistoryLoading(false)
                    }
                }
            }

            loadPrimaryData()

            return () => {
                isMounted = false
            }
        }, [
            getCard,
            getCardStatementForDate,
            getCardStatementHistory,
            resolvedCardId,
        ])
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

    const cardColor = card?.color ?? statement?.color ?? theme.colors.blue
    const cardDisplayName = card?.name ?? statement?.cardName ?? t("credit.cardDetails.unnamed", { defaultValue: "Cartão" })

    const cardLimitValue = card?.limit ?? statement?.limit ?? 0
    const cardLimitUsed = card?.limitUsed ?? statement?.limitUsed ?? 0
    const availableLimitValue = useMemo(() => {
        if (card) {
            return card.limit - card.limitUsed
        }

        if (statement) {
            return statement.availableCredit
        }

        return 0
    }, [card, statement])

    const closingDayValue = card?.closingDay ?? statement?.closingDay ?? 1
    const dueDayValue = card?.dueDay ?? statement?.dueDay ?? closingDayValue

    const historyItems = useMemo(
        () => (statement ? history.filter((item) => item.cycleStart !== statement.cycleStart) : history),
        [history, statement],
    )

    const historyData = historyExpanded ? historyItems : []

    const historySummaryLabel = historyLoading
        ? t("credit.history.loading", { defaultValue: "Carregando extratos" })
        : t("credit.history.collapsedSummary", { count: historyItems.length, defaultValue: "{{count}} extratos anteriores" })

    const statementDueDate = statement ? new Date(`${statement.dueDate}T00:00:00Z`) : null
    const statementCycleStart = statement ? new Date(`${statement.cycleStart}T00:00:00Z`) : null
    const statementCycleEnd = statement ? new Date(`${statement.cycleEnd}T23:59:59Z`) : null

    const statementStatus = useMemo<StatementStatus | null>(() => {
        if (!statement) {
            return null
        }

        const now = new Date()
        const cycleEnd = new Date(`${statement.cycleEnd}T23:59:59Z`)
        const due = new Date(`${statement.dueDate}T23:59:59Z`)

        if (now <= cycleEnd) {
            return "open"
        }

        if (now > due) {
            return "overdue"
        }

        return "closed"
    }, [statement])

    const statementMetrics = useMemo(() => {
        if (!statement) {
            return []
        }

        return [
            {
                key: "realized",
                label: t("credit.statement.realizedTotal", { defaultValue: "Compras lançadas" }),
                value: formatCurrency(statement.realizedTotal),
            },
            {
                key: "projectedRecurring",
                label: t("credit.statement.projectedRecurringTotal", { defaultValue: "Recorrentes previstas" }),
                value: formatCurrency(statement.projectedRecurringTotal),
            },
            {
                key: "projectedInstallment",
                label: t("credit.statement.projectedInstallmentTotal", { defaultValue: "Parcelas previstas" }),
                value: formatCurrency(statement.projectedInstallmentTotal),
            },
            {
                key: "projectedTotal",
                label: t("credit.statement.projectedTotal", { defaultValue: "Total projetado" }),
                value: formatCurrency(statement.projectedTotal),
            },
        ]
    }, [formatCurrency, statement, t])

    const infoRows = useMemo(() => {
        const rows = [
            {
                key: "limit",
                label: t("credit.limit", { defaultValue: "Limite" }),
                value: formatCurrency(cardLimitValue),
            },
            {
                key: "limitUsed",
                label: t("credit.limitUsed", { defaultValue: "Utilizado" }),
                value: formatCurrency(cardLimitUsed),
            },
            {
                key: "available",
                label: t("credit.availableLimit", { defaultValue: "Disponível" }),
                value: formatCurrency(availableLimitValue),
            },
            {
                key: "closingDay",
                label: t("credit.closingDay", { defaultValue: "Fechamento" }),
                value: closingDayValue.toString(),
            },
            {
                key: "dueDay",
                label: t("credit.dueDay", { defaultValue: "Vencimento" }),
                value: dueDayValue.toString(),
            },
        ]

        if (card) {
            rows.push({
                key: "ignoreWeekends",
                label: t("credit.ignoreWeekends", { defaultValue: "Ignorar fins de semana" }),
                value: card.ignoreWeekends
                    ? t("common.yes", { defaultValue: "Sim" })
                    : t("common.no", { defaultValue: "Não" }),
            })
        }

        return rows
    }, [
        availableLimitValue,
        card,
        cardLimitUsed,
        cardLimitValue,
        closingDayValue,
        dueDayValue,
        formatCurrency,
        t,
    ])

    const handleEditCard = useCallback(() => {
        if (!Number.isFinite(resolvedCardId)) {
            return
        }

        router.push({
            pathname: "/(credit)/editCreditCard",
            params: { cardId: resolvedCardId.toString() },
        })
    }, [resolvedCardId, router])

    const handleViewPurchases = useCallback(() => {
        if (!Number.isFinite(resolvedCardId)) {
            return
        }

        const params: Record<string, string> = {
            cardId: resolvedCardId.toString(),
        }

        const name = card?.name ?? statement?.cardName
        if (name) {
            params.cardName = name
        }

        router.push({
            pathname: "/(credit)/cardPurchases",
            params,
        })
    }, [card?.name, resolvedCardId, router, statement?.cardName])

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
            const title = card?.name ?? statement?.cardName ?? t("nav.credit.index")
            navigation.setOptions({ title })
        }, [card?.name, navigation, statement?.cardName, t])
    )

    if (loading || statementLoading) {
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

    if (!card && !statement) {
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

    const showRecurringWarning = (
        recurringCreditWarning?.reason === "INSUFFICIENT_CREDIT_LIMIT" &&
        recurringCreditWarning.cardId === (card?.id ?? statement?.cardId ?? -1)
    )
    const warningAmount = showRecurringWarning ? recurringCreditWarning.attemptedAmount / 100 : 0
    const warningAvailable = showRecurringWarning ? recurringCreditWarning.availableLimit / 100 : 0
    const warningCardName = recurringCreditWarning?.cardName ?? cardDisplayName

    const statementStatusLabel = statementStatus
        ? t(`credit.statement.status.${statementStatus}`, {
              defaultValue:
                  statementStatus === "open"
                      ? "Fatura em aberto"
                      : statementStatus === "closed"
                      ? "Fatura fechada"
                      : "Fatura vencida",
          })
        : null
    const statementPeriodLabel =
        statementCycleStart && statementCycleEnd
            ? t("credit.statement.period", {
                  defaultValue: "Período: {{start}} a {{end}}",
                  start: shortDateFormatter.format(statementCycleStart),
                  end: shortDateFormatter.format(statementCycleEnd),
              })
            : null
    const statementDueLabel =
        statementDueDate && statement
            ? t("credit.statement.due", {
                  defaultValue: "Vence em {{date}}",
                  date: longDateFormatter.format(statementDueDate),
              })
            : null
    const transactionsCountLabel = statement
        ? t("credit.statement.transactionsCount", {
              count: statement.transactionsCount,
              defaultValue: "{{count}} compras",
          })
        : null
    const statementUnavailableLabel = t("credit.statement.unavailable", {
        defaultValue: "Não foi possível carregar o resumo desta fatura.",
    })
    const statementTitle = t("credit.statement.currentTitle", { defaultValue: "Fatura atual" })
    const historyTitle = t("credit.history.title", { defaultValue: "Histórico de faturas" })
    const viewPurchasesLabel = t("credit.statement.viewPurchases", { defaultValue: "Ver compras" })
    const statementButtonDescription = t("credit.statement.viewPurchasesDescription", {
        defaultValue: "Veja todas as compras registradas para este cartão.",
    })
    const statusTextColor =
        statementStatus === "open"
            ? theme.colors.green
            : statementStatus === "overdue"
            ? theme.colors.red
            : theme.text.secondaryLabel

    const dueTextColor = statementStatus === "overdue" ? theme.colors.red : theme.text.secondaryLabel

    const historyToggleIcon = historyExpanded ? "chevron.up" : "chevron.down"
    const historyToggleAndroidIcon = historyExpanded ? "expand-less" : "expand-more"

    const renderHistoryItem: ListRenderItem<CardStatementCycleSummary> = ({ item }) => {
        const referenceDate = new Date(`${item.referenceMonth}-01T00:00:00Z`)
        const itemCycleStart = new Date(`${item.cycleStart}T00:00:00Z`)
        const itemCycleEnd = new Date(`${item.cycleEnd}T23:59:59Z`)
        const itemDueDate = new Date(`${item.dueDate}T00:00:00Z`)

        const periodLabel = t("credit.statement.period", {
            defaultValue: "Período: {{start}} a {{end}}",
            start: shortDateFormatter.format(itemCycleStart),
            end: shortDateFormatter.format(itemCycleEnd),
        })
        const dueLabel = t("credit.statement.due", {
            defaultValue: "Vence em {{date}}",
            date: longDateFormatter.format(itemDueDate),
        })
        const transactionsLabel = t("credit.history.transactionsCount", {
            count: item.transactionsCount,
            defaultValue: "{{count}} compras",
        })

        return (
            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: layout.radius.groupedView,
                    paddingVertical: layout.spacing.lg,
                    paddingHorizontal: layout.spacing.lg,
                    marginTop: layout.margin.sectionGap / 2,
                    gap: 6,
                }}
            >
                <Text
                    style={[FontStyles.subhead, { color: theme.text.secondaryLabel, textTransform: "capitalize" }]}
                >
                    {monthFormatter.format(referenceDate)}
                </Text>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>{formatCurrency(item.realizedTotal)}</Text>
                <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>{periodLabel}</Text>
                <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>{dueLabel}</Text>
                <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>{transactionsLabel}</Text>
            </View>
        )
    }

    const historyKeyExtractor = useCallback(
        (item: CardStatementCycleSummary) => `${item.cardId}-${item.cycleStart}`,
        [],
    )

    const renderHistoryEmpty = useCallback(() => {
        return (
            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: layout.radius.groupedView,
                    paddingVertical: layout.spacing.lg,
                    paddingHorizontal: layout.spacing.lg,
                    marginTop: layout.margin.sectionGap / 2,
                    alignItems: "center",
                    gap: 8,
                }}
            >
                {historyLoading ? (
                    <>
                        <ActivityIndicator color={theme.text.secondaryLabel} />
                        <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                            {t("credit.history.loading", { defaultValue: "Carregando extratos" })}
                        </Text>
                    </>
                ) : (
                    <Text style={{ color: theme.text.secondaryLabel, fontSize: 13, textAlign: "center" }}>
                        {t("credit.history.empty", { defaultValue: "Nenhum extrato anterior encontrado." })}
                    </Text>
                )}
            </View>
        )
    }, [
        historyLoading,
        layout.margin.sectionGap,
        layout.radius.groupedView,
        layout.spacing.lg,
        theme.background.group.secondaryBg,
        theme.text.secondaryLabel,
        t,
    ])
    const renderHeader = () => (
        <View style={{ gap: layout.margin.sectionGap }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <CreditCardView color={cardColor} name={cardDisplayName} />
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
                            defaultValue:
                                "Não foi possível lançar {{amount}} no cartão {{card}}. Limite disponível: {{available}}.",
                            amount: formatCurrency(warningAmount),
                            available: formatCurrency(warningAvailable),
                            card: warningCardName,
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
                    gap: layout.spacing.md,
                }}
            >
                <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>{statementTitle}</Text>

                {statement ? (
                    <>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            {statementStatusLabel ? (
                                <View
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 4,
                                        borderRadius: 999,
                                        backgroundColor: theme.background.group.tertiaryBg,
                                    }}
                                >
                                    <Text style={{ color: statusTextColor, fontSize: 13, fontWeight: "600" }}>
                                        {statementStatusLabel}
                                    </Text>
                                </View>
                            ) : null}

                            {statementDueLabel ? (
                                <Text style={{ color: dueTextColor, fontSize: 13 }}>{statementDueLabel}</Text>
                            ) : null}
                        </View>

                        {statementPeriodLabel ? (
                            <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                {statementPeriodLabel}
                            </Text>
                        ) : null}

                        <View style={{ gap: layout.spacing.md }}>
                            {statementMetrics.map((metric) => (
                                <View key={metric.key} style={{ gap: 2 }}>
                                    <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                                        {metric.label}
                                    </Text>
                                    <Text style={[FontStyles.title3, { color: theme.text.label }]}>{metric.value}</Text>
                                </View>
                            ))}
                        </View>

                        {transactionsCountLabel ? (
                            <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                {transactionsCountLabel}
                            </Text>
                        ) : null}

                        <View style={{ gap: 8 }}>
                            <View style={{ alignSelf: "stretch" }}>
                                <PrimaryButton label={viewPurchasesLabel} onPress={handleViewPurchases} />
                            </View>
                            <Text style={{ color: theme.text.secondaryLabel, fontSize: 13, textAlign: "center" }}>
                                {statementButtonDescription}
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                        {statementUnavailableLabel}
                    </Text>
                )}
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
                    <View key={row.key} style={{ gap: 4 }}>
                        <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>{row.label}</Text>
                        <Text style={[FontStyles.title3, { color: theme.text.label }]}>{row.value}</Text>
                    </View>
                ))}
            </View>

            <View
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: layout.radius.groupedView,
                    paddingVertical: layout.spacing.md,
                    paddingHorizontal: layout.spacing.lg,
                    gap: layout.spacing.sm,
                }}
            >
                <TouchableOpacity
                    onPress={() => setHistoryExpanded((prev) => !prev)}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>{historyTitle}</Text>
                    <AppIcon
                        name={historyToggleIcon}
                        androidName={historyToggleAndroidIcon}
                        size={18}
                        tintColor={theme.text.secondaryLabel}
                    />
                </TouchableOpacity>
                {!historyExpanded ? (
                    <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>{historySummaryLabel}</Text>
                ) : null}
            </View>
        </View>
    )
    const renderFooter = () => (
        <View style={{ marginTop: layout.margin.sectionGap }}>
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
                        {t("credit.installmentsSection.empty", {
                            defaultValue: "Nenhuma compra parcelada registrada para este cartão.",
                        })}
                    </Text>
                ) : (
                    installmentSchedules.map((schedule) => {
                        const nextDueLabel = schedule.nextDueDate
                            ? shortMonthFormatter.format(new Date(`${schedule.nextDueDate}:00Z`))
                            : null

                        const remainingLabel = t("credit.installmentsSection.remaining", {
                            defaultValue: "Restam {{remaining}} de {{total}}",
                            remaining: schedule.remainingCount,
                            total: schedule.installmentsCount,
                        })

                        const formattedInstallment = formatCurrency(schedule.installmentValue / 100)

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
                                    {schedule.description ||
                                        t("credit.installmentsSection.unnamed", { defaultValue: "Compra parcelada" })}
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
        </View>
    )

    return (
        <FlatList
            data={historyData}
            keyExtractor={historyKeyExtractor}
            renderItem={renderHistoryItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={historyExpanded ? renderHistoryEmpty : undefined}
            contentContainerStyle={{
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: layout.margin.sectionGap * 2,
                gap: layout.margin.sectionGap,
            }}
            showsVerticalScrollIndicator={false}
        />
    )
}

