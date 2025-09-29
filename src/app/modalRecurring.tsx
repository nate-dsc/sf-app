import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";

type AddModalProps = {
    visible: boolean,
    onClose: () => void,
}

export default function Recurring({visible, onClose}: AddModalProps) {

    const headerHeight = useHeaderHeight()
    const router = useRouter()
    
    return(
            <View style={[{paddingTop: headerHeight}]}>
                <KeyboardAvoidingView behavior="padding" contentContainerStyle={{flex: 1}}>
                    <ScrollView contentContainerStyle={styles.modalView}>
                       
                        <Text onPress={() => router.back()}> This is the screen to extract the RRULE from the user </Text>

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