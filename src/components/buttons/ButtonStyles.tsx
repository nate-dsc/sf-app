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
        alignItems: "center",

        shadowColor: "#3ADD63",
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.35,
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
    confirmButtonDisabled: {
        backgroundColor: Colors.menuItem.background,
        borderColor: Colors.menuItem.border,
    },
    cancelButton: {
        opacity: 0.7,
        flex: 1,
        backgroundColor: Colors.custom.red,
        borderWidth: 1,
        borderColor: Colors.tile.negativeTint,
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