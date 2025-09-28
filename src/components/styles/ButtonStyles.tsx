import { Colors } from "@/components/styles/Colors"
import { StyleSheet } from "react-native"

export const ButtonStyles = StyleSheet.create({
    addButton: {
        zIndex: 1,
        backgroundColor: Colors.green,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    },
    confirmButton: {
        flex: 1,
        backgroundColor: Colors.green,
        borderRadius: 8,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    }
})