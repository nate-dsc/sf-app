import SegmentedControl from "@/components/pickers/SegmentedControl";
import { FontStyles } from "@/components/styles/FontStyles";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, StyleSheet, Text, View } from "react-native";
import CancelButton from "../buttons/CancelButton";
import ConfirmButton from "../buttons/ConfirmButton";
import DescriptionInput from "../menu-items/DescriptionInput";
import ValueInput from "../menu-items/ValueInput";

type AddModalProps = {
    visible: boolean,
    onClose: () => void,
}

export default function AddModal({visible, onClose}: AddModalProps) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const segmentOptions = ["Inflow", "Outflow"];
    
    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <KeyboardAvoidingView behavior="padding" contentContainerStyle={{flex: 1, rowGap: 12}}>
                    <View style={styles.modalView}>

                        <View style={{flexDirection: "row", marginBottom: 16}}>
                            <Text style={[{flex: 1}, FontStyles.mainTitle]}> New transaction </Text>
                        </View>

                        <SegmentedControl
                            options={segmentOptions}
                            selectedValue={selectedIndex}
                            onChange={setSelectedIndex}
                        />

                        <ValueInput leftText="Value"/>

                        <DescriptionInput leftText="description"/>


                        <View style={{flexDirection: "row", columnGap: 12}}>
                            <CancelButton onPress={onClose}/>
                            <ConfirmButton/>
                        </View>
                    </View>
                    
                </KeyboardAvoidingView>
            </View>
        </Modal>
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
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        rowGap: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});