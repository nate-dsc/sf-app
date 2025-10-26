import CancelSaveButtons from "@/components/buttons/CancelSaveCombo";
import CreditCardCarousel from "@/components/credit-card-items/CreditCardCarousel";
import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GPopup from "@/components/grouped-list-components/GroupedPopup";
import GSwitch from "@/components/grouped-list-components/GroupedSwitch";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import GroupView from "@/components/grouped-list-components/GroupView";
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact";
import { useNewTransaction } from "@/context/NewTransactionContext";
import { useStyle } from "@/context/StyleContext";
import { useTransactionDatabase } from "@/database/useTransactionDatabase";
import i18n from "@/i18n";
import { SCOption } from "@/types/components";
import { CCard, Flow } from "@/types/transaction";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, View } from "react-native";



export default function AddModal() {

    const router = useRouter()
    const params = useLocalSearchParams<{ type?: string }>()
    const {t} = useTranslation()
    const {newTransaction, updateNewTransaction, setNewTransaction, saveTransaction, isValid} = useNewTransaction()
    const { getCards } = useTransactionDatabase()

    const [newDate, setNewDate] = useState<Date>(new Date())
    const [cards, setCards] = useState<CCard[]>([])
    const [cardsLoading, setCardsLoading] = useState(true)

    const {theme, layout} = useStyle()

    const rawType = params.type
    const normalizedType = Array.isArray(rawType) ? rawType[0] : rawType
    const shouldUseCreditOnMount = normalizedType === "installment"

    const flowOptions: SCOption<Flow>[] = [
        {label: t("modalAdd.inflow"), value: "inflow"},
        {label: t("modalAdd.outflow"), value: "outflow"}
    ]

    const handleToggleCredit = async (value: boolean) => {
        if (value) {
            setCardsLoading(true)

            try {
                const response = await getCards()
                setCards(response)

                if (response.length === 0) {
                    Alert.alert(
                        t("modalAdd.noCardsAvailableTitle", { defaultValue: "Nenhum cartão disponível" }),
                        t("modalAdd.noCardsAvailableMessage", { defaultValue: "Cadastre um cartão para usar esta opção." })
                    )
                    setCardsLoading(false)
                    return
                }

                const hasSelectedCard = !!newTransaction.cardId && response.some((card) => card.id === newTransaction.cardId)
                const defaultCardId = hasSelectedCard ? newTransaction.cardId : response[0]?.id

                updateNewTransaction({
                    useCreditCard: true,
                    cardId: defaultCardId ?? undefined,
                    flowType: "outflow"
                })

            } catch (error) {
                console.log("Erro ao carregar cartões:", error)
            } finally {
                setCardsLoading(false)
            }

        } else {
            updateNewTransaction({ useCreditCard: false, cardId: undefined })
        }
    }

    useEffect(() => {
        // Limpa para garantir que não estamos editando uma transação antiga
        setNewTransaction({ flowType: "outflow", date: newDate, useCreditCard: shouldUseCreditOnMount })

        if (shouldUseCreditOnMount) {
            void handleToggleCredit(true)
        }

        return () => {
            // Limpa ao sair da tela para não sujar a próxima abertura do modal
            setNewTransaction({})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleConfirm = async () => {
        try {
            await saveTransaction();
            router.back(); // Só volta se salvar com sucesso
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

            console.log("Falha ao salvar. Tente novamente.", error);
        }
    }

    const selectedCard = useMemo(() => {
        if (!newTransaction.cardId) {
            return null
        }

        return cards.find((card) => card.id === newTransaction.cardId) ?? null
    }, [cards, newTransaction.cardId])

    const formattedAvailableLimit = useMemo(() => {
        if (!selectedCard) {
            return null
        }

        const available = (selectedCard.limit - selectedCard.limitUsed) / 100

        return new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(available)
    }, [selectedCard])
    
    return(
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                gap: layout.margin.sectionGap
            }}
        >
            <SegmentedControlCompact
                options={flowOptions}
                selectedValue={newTransaction.flowType || "outflow"}
                onChange={(optionValue) => {
                    updateNewTransaction({
                        flowType: optionValue,
                        category: undefined
                    })
                    if(optionValue === "inflow") { updateNewTransaction({useCreditCard: false})}
                }}
            />

            <GroupView>   
                <GValueInput
                    separator={"translucent"}
                    label={t("modalAdd.value")}
                    acViewKey={"lim"}
                    onChangeNumValue={(numValue) => updateNewTransaction({value: numValue})}
                    flowType={newTransaction.flowType || "outflow"}
                />
                <GTextInput
                    separator={"translucent"}
                    label={t("modalAdd.description")}
                    value={newTransaction.description}
                    onChangeText={(description: string) => updateNewTransaction({ description: description })}
                    acViewKey={"description"}
                    maxLength={20}
                />
                <GDateInput
                    separator="translucent"
                    label={t("modalAdd.date")}
                    value={newDate}
                    onDateChange={(date) => {
                        updateNewTransaction({ date: date })
                        setNewDate(date)
                    }}
                />
                <GPopup
                    separator={"translucent"}
                    label={t("modalAdd.category")}
                    displayValue={newTransaction.category?.label}
                    onPress={() => {router.push("/modalCategoryPicker")}}
                />
                <GPopup
                    separator={"none"}
                    label={t("modalAdd.recurring")}
                    displayValue={newTransaction.rrule ? t("modalAdd.Yes") : t("modalAdd.No")}
                    onPress={() => {router.push("/modalRecurring")}}
                />
            </GroupView>

            {newTransaction.rruleDescription ?
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{fontSize: 15, lineHeight: 20, color: theme.text.secondaryLabel}}
                    >
                        {newTransaction.rruleDescription?.replace(/\n/g, " ")}
                    </Text>
                </View>
            : null}

            <GroupView>
                <GSwitch
                    separator={newTransaction.useCreditCard ? "translucent" : "none"}
                    label={t("modalAdd.useCredit")}
                    value={!!newTransaction.useCreditCard}
                    onValueChange={handleToggleCredit}
                    disabled={newTransaction.flowType === "inflow"}
                />
                {newTransaction.useCreditCard ? (
                    <View style={{ paddingTop: 12, paddingBottom: 16 }}>
                        {cardsLoading ? (
                            <Text style={{ color: theme.text.secondaryLabel }}>
                                {t("modalAdd.loadingCards")}
                            </Text>
                        ) : cards.length === 0 ? (
                            <Text style={{ color: theme.text.secondaryLabel }}>
                                {t("modalAdd.noCardsAvailable")}
                            </Text>
                        ) : (
                            <>
                                <CreditCardCarousel
                                    cards={cards}
                                    selectedCard={selectedCard}
                                    onSelectCard={(card) => updateNewTransaction({ cardId: card.id })}
                                />
                                {formattedAvailableLimit ? (
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={{ color: theme.text.secondaryLabel, fontSize: 13 }}>
                                            {t("modalAdd.availableLimit", {
                                                defaultValue: "Limite disponível: {{value}}",
                                                value: formattedAvailableLimit
                                            })}
                                        </Text>
                                    </View>
                                ) : null}
                            </>
                        )}
                    </View>
                ) : null}
            </GroupView>

            <CancelSaveButtons
                cancelAction={() => {router.back()}}
                primaryAction={handleConfirm}
                isPrimaryActive={isValid}
            />
        </ScrollView>
    )
}