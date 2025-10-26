import { ButtonStyles } from "@/components/buttons/ButtonStyles";
import CancelSaveButtons from "@/components/buttons/CancelSaveCombo";
import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GPopup from "@/components/grouped-list-components/GroupedPopup";
import GSwitch from "@/components/grouped-list-components/GroupedSwitch";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import GroupView from "@/components/grouped-list-components/GroupView";
import SegmentedControlCompact from "@/components/recurrence-modal-items/SegmentedControlCompact";
import { useNewTransaction } from "@/context/NewTransactionContext";
import { useStyle } from "@/context/StyleContext";
import i18n from "@/i18n";
import { SCOption } from "@/types/components";
import { Flow } from "@/types/transaction";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";



export default function AddModal() {

    const paddingTop = useHeaderHeight() + 10
    const router = useRouter()
    const {t} = useTranslation()
    const {newTransaction, updateNewTransaction, setNewTransaction, saveTransaction, isValid} = useNewTransaction()

    const [newDate, setNewDate] = useState<Date>(new Date())
    const [numValue, setNumValue] = useState("")

    const {theme, layout} = useStyle()
    const buttonStyles = ButtonStyles(theme)

    const flowOptions: SCOption<Flow>[] = [
        {label: t("modalAdd.inflow"), value: "inflow"},
        {label: t("modalAdd.outflow"), value: "outflow"}
    ]

    useEffect(() => {
        // Limpa para garantir que não estamos editando uma transação antiga
        setNewTransaction({ flowType: "outflow", date: newDate }); // Define um valor inicial

        return () => {
            // Limpa ao sair da tela para não sujar a próxima abertura do modal
            setNewTransaction({});
      }
    }, []);

    const handleConfirm = async () => {
        try {
            await saveTransaction();
            router.back(); // Só volta se salvar com sucesso
        } catch (error) {
            // O erro já foi logado no contexto, mas aqui você pode
            // mostrar uma mensagem para o usuário (ex: um Toast ou Alert)
            console.log("Falha ao salvar. Tente novamente.");
        }
    }

    const handleDecimalString = (decimalString: string) => {
        if (!decimalString) {
            updateNewTransaction({ value: undefined });
            return;
        }

        const cleanString = i18n.language === "en-US" ? decimalString.replace(/,/g, '') 
        : decimalString.replace(/\./g, '').replace(',', '.')

        const parsedValue = parseFloat(cleanString)
        console.log(isNaN(parsedValue))

        if(isNaN(parsedValue)) {
            updateNewTransaction({value: undefined})
            setNumValue("")
            console.log(`updateNewTransaction({value: ${undefined}})`)
        } else {
            const floatValue = 100*parsedValue
            const centValue = Math.floor(floatValue)
            if(centValue != 0) {
                updateNewTransaction({value: centValue})
                console.log(`updateNewTransaction({value: ${centValue}})`)
            }
        }
    }
    
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
                onChange={(optionValue) => updateNewTransaction({
                    flowType: optionValue,
                    category: undefined
                })}
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
                    separator={"none"}
                    label={t("modalAdd.useCredit")}
                    value={true}
                    onValueChange={() => {}}
                />
            </GroupView>

            <CancelSaveButtons
                cancelAction={() => {router.back()}}
                primaryAction={handleConfirm}
                isPrimaryActive={isValid}
            />
        </ScrollView>
    )
}