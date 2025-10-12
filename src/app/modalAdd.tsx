import { ButtonStyles } from "@/components/buttons/ButtonStyles";
import CancelButton from "@/components/buttons/CancelButton";
import ConfirmButton from "@/components/buttons/ConfirmButton";
import DatePicker from "@/components/menu-items/DatePicker";
import DescriptionInput from "@/components/menu-items/DescriptionInput";
import SRedir from "@/components/menu-items/RedirSelect";
import SegmentedControl, { SCOption } from "@/components/menu-items/SegmentedControl";
import ValueInput from "@/components/menu-items/ValueInput";
import { useNewTransaction } from "@/context/NewTransactionContext";
import { useTheme } from "@/context/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";



export default function AddModal() {

    type FlowType = "inflow" | "outflow"

    const paddingTop = useHeaderHeight() + 10
    const router = useRouter()
    const {t} = useTranslation()
    const {newTransaction, updateNewTransaction, setNewTransaction, saveTransaction, isValid} = useNewTransaction()

    const [selectedFlow, setSelectedFlow] = useState<FlowType>("outflow")
    const [newDate, setNewDate] = useState<Date>(new Date())
    
    const [numValue, setNumValue] = useState("")
    const [newDescription, setNewDescription] = useState("")

    const {theme, preference, setPreference} = useTheme()
    const buttonStyles = ButtonStyles(theme)

    const flowOptions: SCOption<FlowType>[] = [
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
    
    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, styles.modalView]}>
            <SegmentedControl
                options={flowOptions}
                selectedValue={newTransaction.flowType || "outflow"}
                onChange={(optionValue) => updateNewTransaction({
                    flowType: optionValue,
                    category: undefined
                })}
            />

            <ValueInput leftText={t("modalAdd.value")} value={numValue}
                onChangeText={(value: string) => {
                    Number(value) === 0 ? setNumValue(""): setNumValue(value)
                    updateNewTransaction({value: Number(value)})
                }}
            />

            <DescriptionInput leftText={t("modalAdd.description")} value={newDescription}
                onChangeText={(description: string) => {
                    setNewDescription(description)
                    updateNewTransaction({description: description})
                }}/>

            <DatePicker text={t("modalAdd.date")} onDateChange={(date) => updateNewTransaction({ date: date })} value={newDate} />

            <SRedir
                text={t("modalAdd.category")} 
                selectText={newTransaction.category?.label}
                onPress={() => {router.push("/modalCategoryPicker")}}
            />

            <SRedir 
                text={t("modalAdd.recurring")}
                selectText={newTransaction.rrule ? t("modalAdd.Yes") : t("modalAdd.No")}
                onPress={() => {router.push("/modalRecurring")}}
            />

            <View style={{flexDirection: "row", columnGap: 12}}>
                <CancelButton buttonText={t("buttons.cancel")} onPress={() => {router.back()}}/>
                <ConfirmButton style={[buttonStyles.confirmButton, !isValid && buttonStyles.confirmButtonDisabled]}onPress={handleConfirm} disabled={!isValid} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido,
        rowGap: 12
    },
    modalView: {
        //borderRadius: 20,
        paddingHorizontal: 20,
        rowGap: 12,
        alignItems: 'center',
    },
});