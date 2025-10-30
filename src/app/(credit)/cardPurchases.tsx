import TransactionList from "@/components/history-screen-items/TransactionList/TransactionList"
import TransactionModal from "@/components/history-screen-items/TransactionList/TransactionModal"
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { CardPurchaseTypeFilter, SearchFilters, Transaction } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, Text, View } from "react-native"

const PURCHASE_FILTER_OPTIONS: CardPurchaseTypeFilter[] = ["all", "installments", "recurring", "single"]

function resolveParamValue(value?: string | string[]) {
    if (!value) {
        return undefined
    }

    return Array.isArray(value) ? value[0] : value
}

export default function CardPurchasesScreen() {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const navigation = useNavigation()
    const headerHeight = useHeaderHeight()
    const { cardId, cardName } = useLocalSearchParams<{ cardId?: string | string[]; cardName?: string | string[] }>()

    const resolvedCardId = useMemo(() => {
        const value = resolveParamValue(cardId)
        if (!value) {
            return NaN
        }

        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : NaN
    }, [cardId])

    const resolvedCardName = resolveParamValue(cardName)

    const [filterType, setFilterType] = useState<CardPurchaseTypeFilter>("all")
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const title = resolvedCardName
            ? t("credit.purchases.titleWithName", { name: resolvedCardName, defaultValue: "Compras" })
            : t("credit.purchases.title", { defaultValue: "Compras" })
        navigation.setOptions({ title })
    }, [navigation, resolvedCardName, t])

    const filters = useMemo<SearchFilters>(() => {
        const base: SearchFilters = {
            type: "outflow",
        }

        if (!Number.isFinite(resolvedCardId)) {
            return base
        }

        base.cardId = resolvedCardId

        if (filterType === "installments") {
            base.cardChargeType = "installments"
        } else if (filterType === "recurring") {
            base.cardChargeType = "recurring"
        } else if (filterType === "single") {
            base.cardChargeType = "single"
        }

        return base
    }, [filterType, resolvedCardId])

    const filterOptions = useMemo(
        () =>
            PURCHASE_FILTER_OPTIONS.map((value) => ({
                label: t(`credit.purchases.filters.${value}`, {
                    defaultValue:
                        value === "installments"
                            ? "Parceladas"
                            : value === "recurring"
                            ? "Recorrentes"
                            : value === "single"
                            ? "Avulsas"
                            : "Todas",
                }),
                value,
            })),
        [t],
    )

    const handleItemPress = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setModalVisible(true)
    }

    const handleModalClose = () => {
        setModalVisible(false)
    }

    if (!Number.isFinite(resolvedCardId)) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: layout.margin.contentArea,
                    backgroundColor: theme.background.bg,
                    gap: 12,
                }}
            >
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                    {t("credit.purchases.invalidCard", { defaultValue: "Não foi possível carregar as compras." })}
                </Text>
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel, textAlign: "center" }]}>
                    {t("credit.purchases.invalidCardDescription", {
                        defaultValue: "Verifique o cartão selecionado e tente novamente.",
                    })}
                </Text>
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background.bg,
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
            }}
        >
            <View style={{ gap: layout.spacing.md }}>
                <Text style={[FontStyles.title3, { color: theme.text.label }]}>
                    {t("credit.purchases.heading", { defaultValue: "Compras do cartão" })}
                </Text>
                <Text style={{ color: theme.text.secondaryLabel }}>
                    {t("credit.purchases.description", { defaultValue: "Filtre e veja todas as compras registradas." })}
                </Text>
                <SegmentedControlCompact
                    options={filterOptions}
                    selectedValue={filterType}
                    onChange={setFilterType}
                />
            </View>

            <View style={{ flex: 1, marginTop: layout.margin.sectionGap }}>
                <TransactionList filters={filters} onItemPress={handleItemPress} />
            </View>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <TransactionModal transaction={selectedTransaction} onBackgroundPress={handleModalClose} />
            </Modal>
        </View>
    )
}
