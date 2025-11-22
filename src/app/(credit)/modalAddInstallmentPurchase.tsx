import CancelSaveButtons from "@/components/buttons/CancelSaveCombo"
import CreditCardPicker from "@/components/credit-card-items/CreditCardPicker"
import GDateInput from "@/components/grouped-list-components/GroupedDateInput"
import GPopup from "@/components/grouped-list-components/GroupedPopup"
import GTextInput from "@/components/grouped-list-components/GroupedTextInput"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/CreditCards"
import {
    InstallmentFormValues,
    validateInstallmentForm,
} from "@/utils/InstallmentUtils"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, ScrollView, Text, View } from "react-native"

export default function AddInstallmentPurchaseModal() {
    const router = useRouter()
    const { t } = useTranslation()
    const { theme, layout } = useStyle()
    const headerHeight = useHeaderHeight()

    const [newDate, setNewDate] = useState<Date>(new Date())

    const {
        newTransaction,
        updateNewTransaction,
        setNewTransaction,
        saveInstallmentPurchase,
        isInstallmentValid,
    } = useNewTransaction()
    const { getAllCards } = useTransactionDatabase()

    const [cards, setCards] = useState<CCard[]>([])
    const [cardsLoading, setCardsLoading] = useState(true)
    const [installmentsInput, setInstallmentsInput] = useState("")
    const [touched, setTouched] = useState({
        value: false,
        installments: false,
        description: false,
        category: false,
        purchaseDay: false,
        card: false,
    })

    useEffect(() => {
        const today = new Date()
        setNewTransaction({
            type: "out",
            value: undefined,
            description: "",
            category: undefined,
            cardId: undefined,
            installmentsCount: undefined,
            purchaseDay: today.getDate(),
            date: today,
        })

        setNewDate(today)
        setInstallmentsInput("")
        setTouched({
            value: false,
            installments: false,
            description: false,
            category: false,
            purchaseDay: false,
            card: false,
        })

        return () => {
            setNewTransaction({})
        }
    }, [setNewTransaction])

    useEffect(() => {
        let isMounted = true

        async function loadCards() {
            setCardsLoading(true)
            try {
                const response = await getAllCards()

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
        setTouched((prev) => ({ ...prev, installments: true }))

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

    const formValues: InstallmentFormValues = useMemo(() => ({
        installmentValue: newTransaction.value,
        description: newTransaction.description,
        categoryId: newTransaction.category?.id ?? null,
        installmentsCount: newTransaction.installmentsCount,
        purchaseDay: newTransaction.purchaseDay,
        cardId: newTransaction.cardId,
    }), [
        newTransaction.cardId,
        newTransaction.category?.id,
        newTransaction.description,
        newTransaction.installmentsCount,
        newTransaction.purchaseDay,
        newTransaction.value,
    ])

    const validation = useMemo(() => validateInstallmentForm(formValues), [formValues])

    const resolveErrorMessage = (key?: string, fallback?: string) => {
        if (!key) {
            return undefined
        }

        return t(key, { defaultValue: fallback })
    }

    const valueError = touched.value
        ? resolveErrorMessage(validation.errors.installmentValue, t("installmentModal.validation.valueRequired", { defaultValue: "Informe o valor da parcela." }))
        : undefined

    const installmentsError = touched.installments
        ? resolveErrorMessage(validation.errors.installmentsCount, t("installmentModal.validation.installmentsRequired", { defaultValue: "Informe o número de parcelas." }))
        : undefined

    const descriptionError = touched.description
        ? resolveErrorMessage(validation.errors.description, t("installmentModal.validation.descriptionRequired", { defaultValue: "Informe uma descrição." }))
        : undefined

    const categoryError = touched.category
        ? resolveErrorMessage(validation.errors.category, t("installmentModal.validation.categoryRequired", { defaultValue: "Selecione uma categoria." }))
        : undefined

    const purchaseDayError = touched.purchaseDay
        ? resolveErrorMessage(validation.errors.purchaseDay, t("installmentModal.validation.purchaseDayRequired", { defaultValue: "Selecione o dia da compra." }))
        : undefined

    const cardError = touched.card
        ? resolveErrorMessage(validation.errors.card, t("installmentModal.validation.cardRequired", { defaultValue: "Selecione um cartão." }))
        : undefined

    const markAllTouched = () => {
        setTouched({
            value: true,
            installments: true,
            description: true,
            category: true,
            purchaseDay: true,
            card: true,
        })
    }

    const handleSave = async () => {
        if (!validation.isValid) {
            markAllTouched()
            return
        }

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

    const renderErrorText = (message?: string) => {
        if (!message) {
            return null
        }

        return (
            <Text style={{ color: theme.colors.red, fontSize: 13, marginTop: 4 }}>
                {message}
            </Text>
        )
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
                    label={t("modalAddInstallment.value")}
                    acViewKey="installmentValue"
                    onChangeNumValue={(value) => {
                        setTouched((prev) => ({ ...prev, value: true }))
                        updateNewTransaction({ value })
                    }}
                    valueInCents={newTransaction.value}
                    transactionType="out"
                />
                <GTextInput
                    separator="translucent"
                    label={t("modalAddInstallment.count")}
                    acViewKey="installments"
                    onChangeText={handleInstallmentsChange}
                    value={installmentsInput}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    maxLength={3}
                />
                <GTextInput
                    separator="translucent"
                    label={t("modalAddInstallment.description")}
                    acViewKey="description"
                    onChangeText={(text) => {
                        setTouched((prev) => ({ ...prev, description: true }))
                        updateNewTransaction({ description: text })
                    }}
                    value={newTransaction.description}
                    maxLength={40}
                />
                <GPopup
                    separator="translucent"
                    label={t("modalAddInstallment.category")}
                    displayValue={newTransaction.category?.label}
                    onPress={() => {
                        setTouched((prev) => ({ ...prev, category: true }))
                        updateNewTransaction({ type: "out" })
                        router.push("/modalCategoryPicker")
                    }}
                />
                <GDateInput
                    separator="none"
                    label={t("modalAddInstallment.date")}
                    value={newDate}
                    onDateChange={(date) => {
                        setTouched((prev) => ({ ...prev, purchaseDay: true }))
                        setNewDate(date)
                        updateNewTransaction({ date, purchaseDay: date.getDate() })
                    }}
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
                        <CreditCardPicker
                            cards={cards}
                            selectedCard={selectedCard}
                            onSelectCard={(card) => {
                                setTouched((prev) => ({ ...prev, card: true }))
                                updateNewTransaction({ cardId: card.id })
                            }}
                        />
                    )}
                    {renderErrorText(cardError)}
                </View>
            </GroupView>

            <CancelSaveButtons
                cancelAction={() => router.back()}
                primaryAction={handleSave}
                isPrimaryActive={isInstallmentValid && !cardsLoading}
            />
        </ScrollView>
    )
}
