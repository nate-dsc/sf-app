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
        borderRadius: 24,
    },
    datePicker: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Colors.menuItem.background,
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 24,
    },
    switch: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Colors.menuItem.background,
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 24,
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Colors.menuItem.background,
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 24,
    },
    text: {
        color: Colors.menuItem.text
    },
    unfocusedText: {
        color: Colors.menuItem.unfocusedText
    },
    icon: {
        color: Colors.menuItem.icons,
    },
    unfocusedIcon: {
        color: Colors.menuItem.unfocusedText
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
        paddingRight: 8,
        gap: 12
    },
    textContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 12,
        gap: 12
    },
    inputTextContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 12,
        gap: 12
    },
    datetimePickerContainer: {
        paddingRight: 7
    },
    switchContainer: {
        paddingRight: 10
    },
    inputContainer: {
        flex: 3,
        paddingRight: 12
    }
})