import CancelButton from "@/components/buttons/CancelButton";
import ConfirmButton from "@/components/buttons/ConfirmButton";
import DatePicker from "@/components/menu-items/DatePicker";
import DescriptionInput from "@/components/menu-items/DescriptionInput";
import SRedir from "@/components/menu-items/RedirSelect";
import SegmentedControl, { SCOption } from "@/components/menu-items/SegmentedControl";
import ValueInput from "@/components/menu-items/ValueInput";
import { useNewTransaction } from "@/context/NewTransactionContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";



export default function AddModal() {

    const paddingTop = useHeaderHeight() + 10
    const router = useRouter()
    const {t} = useTranslation()
    const {newTransaction, updateNewTransaction, setNewTransaction} = useNewTransaction()

    const [selectedFlow, setSelectedFlow] = useState("outflow")

    const flowOptions: SCOption[] = [
        {key: "inflow", value: t("modalAdd.inflow")},
        {key: "outflow", value: t("modalAdd.outflow")}
    ]

    useEffect(() => {
      // Limpa para garantir que não estamos editando uma transação antiga
      setNewTransaction({ flowType: "outflow" }); // Define um valor inicial

      return () => {
        // Limpa ao sair da tela para não sujar a próxima abertura do modal
        setNewTransaction({});
      }
    }, []);
    
    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, styles.modalView]}>
            <SegmentedControl
                options={flowOptions}
                selectedValue={newTransaction.flowType || "outflow"}
                onChange={(newFlowType) => updateNewTransaction({
                    flowType: newFlowType as "inflow" | "outflow",
                    category: undefined
                })}
            />

            <ValueInput leftText={t("modalAdd.value")} />

            <DescriptionInput leftText={t("modalAdd.description")}/>

            <DatePicker text={t("modalAdd.date")} />

            <SRedir
                text={t("modalAdd.category")} 
                selectText={newTransaction.category?.title}
                onPress={() => {router.push("/modalCategoryPicker")}}
            />

            <SRedir text={t("modalAdd.recurring")} onPress={() => {router.push("/modalRecurring")}}/>

            <View style={{flexDirection: "row", columnGap: 12}}>
                <CancelButton onPress={() => {router.back()}}/>
                <ConfirmButton onPress={() => {router.back()}}/>
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