import CancelButton from "@/components/buttons/CancelButton";
import ConfirmButton from "@/components/buttons/ConfirmButton";
import DatePicker from "@/components/menu-items/DatePicker";
import DescriptionInput from "@/components/menu-items/DescriptionInput";
import SRedir from "@/components/menu-items/RedirSelect";
import SegmentedControl from "@/components/menu-items/SegmentedControl";
import ValueInput from "@/components/menu-items/ValueInput";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type AddModalProps = {
    visible: boolean,
    onClose: () => void,
}

export default function AddModal({visible, onClose}: AddModalProps) {

    const [selectedIndex, setSelectedIndex] = useState(0)
    const segmentOptions = ["Inflow", "Outflow"]
    const paddingTop = useHeaderHeight() + 10
    const router = useRouter()
    
    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, styles.modalView]}>
            <SegmentedControl
                options={segmentOptions}
                selectedValue={selectedIndex}
                onChange={setSelectedIndex}
            />

            <ValueInput leftText="Value" />

            <DescriptionInput leftText="Description"/>

            <DatePicker text="Date" />

            <SRedir text="Category" onPress={() => {router.push("/modalCategoryPicker")}}/>

            <SRedir text="Recurring" onPress={() => {router.push("/modalRecurring")}}/>

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