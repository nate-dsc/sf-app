import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const MIStyles = (Colors: typeof light) => StyleSheet.create({
    redir: {
        flexDirection: "row",
        //justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Colors.menuItem.background,
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 8,
    },
    text: {
        color: Colors.menuItem.text
    },
    icon: {
        color: Colors.menuItem.icons,
    },

    leftContainer: {
        paddingLeft: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    textChevronContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 12,
        gap: 12
    }
})