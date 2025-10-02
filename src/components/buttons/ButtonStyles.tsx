import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const ButtonStyles = (Colors: typeof light) => StyleSheet.create({
    addButton: {
        zIndex: 1,
        backgroundColor: Colors.custom.green,
        borderWidth: 1,
        borderColor: "#3ADD63",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    },
    confirmButton: {
        flex: 1,
        backgroundColor: Colors.custom.green,
        borderWidth: 1,
        borderColor: "#3ADD63",
        borderRadius: 24,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "darkgray",
        borderWidth: 1,
        borderColor: Colors.custom.gray,
        borderRadius: 24,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    rButton: {
        backgroundColor: Colors.menuItem.background,
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 8,
        padding: 12
    },
    text: {
        color: Colors.custom.text
    }
})