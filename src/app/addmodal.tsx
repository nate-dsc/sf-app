import CancelButton from "@/components/buttons/CancelButton";
import ConfirmButton from "@/components/buttons/ConfirmButton";
import DescriptionInput from "@/components/inputs/DescriptionInput";
import ValueInput from "@/components/inputs/ValueInput";
import SegmentedControl from "@/components/pickers/SegmentedControl";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";

type AddModalProps = {
    visible: boolean,
    onClose: () => void,
}

export default function AddModal({visible, onClose}: AddModalProps) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const segmentOptions = ["Inflow", "Outflow"];
    const headerHeight = useHeaderHeight()
    const router = useRouter()
    
    return(
            <View style={[{paddingTop: headerHeight}]}>
                <KeyboardAvoidingView behavior="padding" contentContainerStyle={{flex: 1}}>
                    <ScrollView contentContainerStyle={styles.modalView}>
                        <SegmentedControl
                            options={segmentOptions}
                            selectedValue={selectedIndex}
                            onChange={setSelectedIndex}
                        />

                        <ValueInput/>

                        <DescriptionInput/>

                        <View style={{flexDirection: "row", columnGap: 12}}>
                            <CancelButton onPress={() => {router.back()}}/>
                            <ConfirmButton/>
                        </View>
                    </ScrollView>
                    
                </KeyboardAvoidingView>
            </View>
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
        borderRadius: 20,
        paddingHorizontal: 20,
        rowGap: 12,
        alignItems: 'center',
    },
});