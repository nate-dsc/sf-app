import CancelSaveButtons from "@/components/buttons/CancelSaveCombo";
import CreditCardPicker from "@/components/credit-card-items/CreditCardPicker";
import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GPopup from "@/components/grouped-list-components/GroupedPopup";
import GSwitch from "@/components/grouped-list-components/GroupedSwitch";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import GroupView from "@/components/grouped-list-components/GroupView";
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact";
import { useNewTransaction } from "@/context/NewTransactionContext";
import { useStyle } from "@/context/StyleContext";
import { useDatabase } from "@/database/useDatabase";
import i18n from "@/i18n";
import { SCOption } from "@/types/components";
import { CCard } from "@/types/CreditCards";
import type { TransactionType } from "@/types/Transactions";
import { findCategoryByID } from "@/utils/CategoryUtils";
import { describeRRule } from "@/utils/RRULEUtils";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, View } from "react-native";



export default function AddModal() {

    const router = useRouter()
    const {t} = useTranslation()
    const {newTransaction, updateNewTransaction, setNewTransaction, saveAsTransaction, isValidAsTransaction} = useNewTransaction()
    const { getAllCards } = useDatabase()

    const [newDate, setNewDate] = useState<Date>(new Date())
    const [cards, setCards] = useState<CCard[]>([])
    const [cardsLoading, setCardsLoading] = useState(true)

    const {theme, layout} = useStyle()

    const [cardLimitError, setCardLimitError] = useState<string | null>(null)
    const lastReportedLimitErrorRef = useRef<string | null>(null)

    const flowOptions = useMemo<SCOption<TransactionType>[]>(() => [
        {label: t("modalAdd.inflow"), value: "in"},
        {label: t("modalAdd.outflow"), value: "out"}
    ], [t])

    const [useCreditCard, setUseCreditCard] = useState(false)

    useEffect(() => {
        // Limpa para garantir que não estamos editando uma transação antiga
        setNewTransaction({ type: "out", date: newDate }); // Define um valor inicial

        return () => {
            // Limpa ao sair da tela para não sujar a próxima abertura do modal
            setNewTransaction({});
      }
    }, []);


    const handleToggleCredit = async (value: boolean) => {
        if (value) {
            setCardsLoading(true)

            try {
                const response = await getAllCards()
                setCards(response)

                if (response.length === 0) {
                    Alert.alert(
                        t("modalAdd.noCardsAvailableTitle", { defaultValue: "Nenhum cartão disponível" }),
                        t("modalAdd.noCardsAvailableMessage", { defaultValue: "Cadastre um cartão para usar esta opção." })
                    )
                    setCardsLoading(false)
                    return
                }

                const hasSelectedCard = !!newTransaction.cardId && cards.some((card) => card.id === newTransaction.cardId)
                const defaultCardId = hasSelectedCard ? newTransaction.cardId : cards[0]?.id

                setUseCreditCard(true)
                updateNewTransaction({
                    cardId: defaultCardId ?? undefined,
                    type: "out"
                })

            } catch (error) {
                console.log("Erro ao carregar cartões:", error)
            } finally {
                setCardsLoading(false)
            }

        } else {
            setUseCreditCard(false)
            updateNewTransaction({ cardId: undefined })
            setCardLimitError(null)
            lastReportedLimitErrorRef.current = null
        }
    }

    const handleConfirm = async () => {
        try {

            await saveAsTransaction();
            router.back(); // Só volta se salvar com sucesso

        } catch (error) {
           
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

        const available = (selectedCard.maxLimit - selectedCard.limitUsed) / 100

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
                selectedValue={newTransaction.type || "out"}
                onChange={(optionValue) => {
                    updateNewTransaction({
                        type: optionValue,
                        category: undefined
                    })
                    if(optionValue === "in") { setUseCreditCard(false)}
                }}
                disabledOptions={useCreditCard ? ["in" as TransactionType] : []}
            />

            <GroupView>   
                <GValueInput
                    separator={"translucent"}
                    label={t("modalAdd.value")}
                    acViewKey={"lim"}
                    onChangeNumValue={(numValue) => updateNewTransaction({value: numValue})}
                    transactionType={newTransaction.type || "out"}
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
                    displayValue={
                        newTransaction.category ? t(findCategoryByID(newTransaction.category).translationKey) : undefined
                    }
                    onPress={() => {router.push("/modalCategoryPicker")}}
                />
                <GPopup
                    separator={"none"}
                    label={t("modalAdd.recurring")}
                    displayValue={newTransaction.rrule ? t("modalAdd.Yes") : t("modalAdd.No")}
                    onPress={() => {router.push("/modalRecurring")}}
                />
            </GroupView>

            {newTransaction.rrule ?
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{fontSize: 15, lineHeight: 20, color: theme.text.secondaryLabel}}
                    >
                        {describeRRule(newTransaction.rrule, t).replace(/\n/g, " ")}
                    </Text>
                </View>
            : null}

            <GroupView>
                <GSwitch
                    separator={useCreditCard ? "translucent" : "none"}
                    label={t("modalAdd.useCredit")}
                    value={useCreditCard}
                    onValueChange={handleToggleCredit}
                    disabled={newTransaction.type === "in"}
                />
                {useCreditCard ? (
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
                                <CreditCardPicker
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
                                {cardLimitError ? (
                                    <View
                                        style={{
                                            marginTop: 12,
                                            padding: 12,
                                            borderRadius: 12,
                                            backgroundColor: theme.background.group.tertiaryBg,
                                        }}
                                    >
                                        <Text style={{ color: theme.colors.red, fontSize: 13, lineHeight: 18 }}>
                                            {cardLimitError}
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
                isPrimaryActive={isValidAsTransaction}
            />
        </ScrollView>
    )
}