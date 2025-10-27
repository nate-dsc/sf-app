import CancelSaveButtons from "@/components/buttons/CancelSaveCombo"
import CreditCardCarousel from "@/components/credit-card-items/CreditCardCarousel"
import DayPickerModal from "@/components/credit-card-items/DayPickerModal"
import GPopup from "@/components/grouped-list-components/GroupedPopup"
import GTextInput from "@/components/grouped-list-components/GroupedTextInput"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Modal, ScrollView, Text, View } from "react-native"

export default function AddInstallmentPurchaseModal() {
    const router = useRouter()
    const { t } = useTranslation()
    const { theme, layout } = useStyle()
    const headerHeight = useHeaderHeight()

    const {
        newTransaction,
        updateNewTransaction,
        setNewTransaction,
        saveInstallmentPurchase,
        isInstallmentValid,
    } = useNewTransaction()
    const { getCards } = useTransactionDatabase()

    const [cards, setCards] = useState<CCard[]>([])
    const [cardsLoading, setCardsLoading] = useState(true)
    const [dayModalVisible, setDayModalVisible] = useState(false)
    const [installmentsInput, setInstallmentsInput] = useState("")

    useEffect(() => {
        setNewTransaction({
            flowType: "outflow",
            value: undefined,
            description: "",
            category: undefined,
            cardId: undefined,
            installmentsCount: undefined,
            purchaseDay: undefined,
        })

        setInstallmentsInput("")

        return () => {
            setNewTransaction({})
        }
    }, [setNewTransaction])

    useEffect(() => {
        let isMounted = true

        async function loadCards() {
            setCardsLoading(true)
            try {
                const response = await getCards()

                if (isMounted) {
                    setCards(response)
                    if (response.length > 0) {
                        updateNewTransaction({ cardId: response[0].id })
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar cartões:", error)
            } finally {
                if (isMounted) {
                    setCardsLoading(false)
                }
            }
        }

        loadCards()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (newTransaction.installmentsCount) {
            setInstallmentsInput(newTransaction.installmentsCount.toString())
        } else {
            setInstallmentsInput("")
        }
    }, [newTransaction.installmentsCount])

    const selectedCard = useMemo(() => {
        if (!newTransaction.cardId) {
            return null
        }

        return cards.find((card) => card.id === newTransaction.cardId) ?? null
    }, [cards, newTransaction.cardId])

    const handleInstallmentsChange = (value: string) => {
        const digits = value.replace(/[^0-9]/g, "")
        setInstallmentsInput(digits)

        if (digits.length === 0) {
            updateNewTransaction({ installmentsCount: undefined })
            return
        }

        const parsed = Number(digits)
        if (Number.isNaN(parsed) || parsed === 0) {
            updateNewTransaction({ installmentsCount: undefined })
            return
        }

        updateNewTransaction({ installmentsCount: parsed })
    }

    const handleSave = async () => {
        try {
            await saveInstallmentPurchase()
            router.back()
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "INSUFFICIENT_CREDIT_LIMIT") {
                    Alert.alert(
                        t("modalAdd.creditLimitErrorTitle", { defaultValue: "Limite insuficiente" }),
                        t("modalAdd.creditLimitErrorMessage", { defaultValue: "O cartão selecionado não possui limite disponível para esta compra." })
                    )
                    return
                }

                if (error.message === "CARD_NOT_FOUND") {
                    Alert.alert(
                        t("modalAdd.cardNotFoundTitle", { defaultValue: "Cartão não encontrado" }),
                        t("modalAdd.cardNotFoundMessage", { defaultValue: "O cartão selecionado não pôde ser localizado. Tente novamente." })
                    )
                    return
                }
            }

            console.error("Falha ao salvar compra parcelada.", error)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                gap: layout.margin.sectionGap,
            }}
        >
            <GroupView>
                <GValueInput
                    separator="translucent"
                    label={t("installmentModal.installmentValue", { defaultValue: "Valor da parcela" })}
                    acViewKey="installmentValue"
                    onChangeNumValue={(value) => updateNewTransaction({ value })}
                    flowType="outflow"
                />
                <GTextInput
                    separator="translucent"
                    label={t("installmentModal.installments", { defaultValue: "Número de parcelas" })}
                    value={installmentsInput}
                    onChangeText={handleInstallmentsChange}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    acViewKey="installments"
                    maxLength={3}
                />
                <GTextInput
                    separator="translucent"
                    label={t("installmentModal.description", { defaultValue: "Descrição da compra" })}
                    value={newTransaction.description}
                    onChangeText={(text) => updateNewTransaction({ description: text })}
                    acViewKey="description"
                    maxLength={40}
                />
                <GPopup
                    separator="translucent"
                    label={t("installmentModal.category", { defaultValue: "Categoria" })}
                    displayValue={newTransaction.category?.label}
                    onPress={() => {
                        updateNewTransaction({ flowType: "outflow" })
                        router.push("/modalCategoryPicker")
                    }}
                />
                <GPopup
                    separator="none"
                    label={t("installmentModal.purchaseDay", { defaultValue: "Dia da compra" })}
                    displayValue={
                        newTransaction.purchaseDay ? newTransaction.purchaseDay.toString() : undefined
                    }
                    onPress={() => setDayModalVisible(true)}
                />
            </GroupView>

            <GroupView>
                <View style={{ paddingTop: 12, paddingBottom: 16 }}>
                    <Text style={{ color: theme.text.secondaryLabel, marginBottom: 12 }}>
                        {t("installmentModal.selectCard", { defaultValue: "Selecione um cartão de crédito" })}
                    </Text>
                    {cardsLoading ? (
                        <Text style={{ color: theme.text.secondaryLabel }}>
                            {t("modalAdd.loadingCards", { defaultValue: "Carregando cartões..." })}
                        </Text>
                    ) : cards.length === 0 ? (
                        <Text style={{ color: theme.text.secondaryLabel }}>
                            {t("modalAdd.noCardsAvailable", { defaultValue: "Nenhum cartão disponível" })}
                        </Text>
                    ) : (
                        <CreditCardCarousel
                            cards={cards}
                            selectedCard={selectedCard}
                            onSelectCard={(card) => updateNewTransaction({ cardId: card.id })}
                        />
                    )}
                </View>
            </GroupView>

            <CancelSaveButtons
                cancelAction={() => router.back()}
                primaryAction={handleSave}
                isPrimaryActive={isInstallmentValid && !cardsLoading}
            />

            <Modal
                animationType="fade"
                transparent
                visible={dayModalVisible}
                onRequestClose={() => setDayModalVisible(false)}
            >
                <DayPickerModal
                    title={t("installmentModal.purchaseDay", { defaultValue: "Dia da compra" })}
                    selectedDay={newTransaction.purchaseDay ?? 0}
                    onDayPress={(day) => updateNewTransaction({ purchaseDay: day })}
                    onBackgroundPress={() => setDayModalVisible(false)}
                />
            </Modal>
        </ScrollView>
    )
}
