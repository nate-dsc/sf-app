import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const ButtonStyles = (Colors: typeof light) => StyleSheet.create({
    addButton: {
        zIndex: 1,
        backgroundColor: Colors.custom.green,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    },
    confirmButton: {
        flex: 1,
        backgroundColor: Colors.custom.green,
        borderRadius: 8,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.custom.gray,
        borderRadius: 8,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    }
})