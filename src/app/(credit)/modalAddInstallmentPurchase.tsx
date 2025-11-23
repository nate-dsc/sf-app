import LabeledButton from "@/components/buttons/LabeledButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import CreditCardPicker from "@/components/credit-card-items/CreditCardPicker"
import GDateInput from "@/components/grouped-list-components/GroupedDateInput"
import GPopup from "@/components/grouped-list-components/GroupedPopup"
import GTextInput from "@/components/grouped-list-components/GroupedTextInput"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useStyle } from "@/context/StyleContext"
import { useDatabase } from "@/database/useDatabase"
import { CCard } from "@/types/CreditCards"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"

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
        saveAsInstallmentPurchase,
        isValidAsInstallmentPurchase,
    } = useNewTransaction()
    const { getAllCards } = useDatabase()

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


    

    const handleSave = async () => {
        if (!isValidAsInstallmentPurchase) {
            return
        }

        try {
            await saveAsInstallmentPurchase()
            router.back()
        } catch (error) {

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
                    label={t("modalAddInstallment.value")}
                    acViewKey="installmentValue"
                    onChangeNumValue={(value) => {
                        setTouched((prev) => ({ ...prev, value: true }))
                        updateNewTransaction({ value })
                    }}
                    valueInCents={newTransaction.value}
                    transactionType="out"
                    labelFlex={3}
                    fieldFlex={2}
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
                    labelFlex={3}
                    fieldFlex={2}
                />
                <GTextInput
                    separator="translucent"
                    label={t("modalAddInstallment.description")}
                    acViewKey="description"
                    onChangeText={(text) => updateNewTransaction({ description: text })}
                    value={newTransaction.description}
                    maxLength={40}
                />
                <GPopup
                    separator="translucent"
                    leadingLabel={t("modalAddInstallment.category")}
                    displayValue={
                        newTransaction.category ? t(findCategoryByID(newTransaction.category).translationKey) : undefined
                    }
                    onPress={() => {
                        updateNewTransaction({ type: "out" })
                        router.push("/modalCategoryPicker")
                    }}
                />
                <GDateInput
                    separator="none"
                    leadingLabel={t("modalAddInstallment.date")}
                    value={newDate}
                    onDateChange={(date) => {
                        setNewDate(date)
                        updateNewTransaction({ date })
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
                </View>
            </GroupView>
            
            <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{flex: 1}}>
                    <LabeledButton
                        label={t("buttons.cancel")}
                        onPress={() => router.back()}
                        disabled={false}
                    />
                </View>
                <View style={{flex: 1}}>
                    <PrimaryButton
                        label={t("buttons.save")}
                        onPress={handleSave}
                        disabled={!(isValidAsInstallmentPurchase && !cardsLoading)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}
