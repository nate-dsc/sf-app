import CategorySelection from "@/components/pickers/CategorySelection";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";

export default function CategoryPicker() {

    const headerHeight = useHeaderHeight()
    const router = useRouter()
    
    return(
            <View style={[{paddingTop: headerHeight}]}>
                <KeyboardAvoidingView behavior="padding" contentContainerStyle={{flex: 1}}>
                    <ScrollView>
                        <View style={styles.modalView}>
                            <CategorySelection options={[""]} onSelection={() => router.back()}/>
                        </View>

                    </ScrollView>
                    
                </KeyboardAvoidingView>
            </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
    },
});