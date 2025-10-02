import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const MIStyles = (Colors: typeof light) => StyleSheet.create({
    redir: {
        flexDirection: "row",
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
    segment: {
        flex: 1,
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: Colors.menuItem.background
    },
    activeSegment: {
        flex: 1,
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: Colors.menuItem.tint
    },



    //Text and icon colors
    text: {
        color: Colors.menuItem.text
    },
    textUnfocused: {
        color: Colors.menuItem.textUnfocused
    },
    textInverted: {
        color: Colors.menuItem.textInverted
    },
    textOverTint :{
        color: Colors.menuItem.textOverTint
    },
    icon: {
        color: Colors.menuItem.icons,
    },
    iconUnfocused: {
        color: Colors.menuItem.textUnfocused
    },
    iconInverted: {
        color: Colors.menuItem.textInverted
    },
    iconOverTint: {
        color: Colors.menuItem.textOverTint
    },


    //Containers
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
    },
    segmentContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.menuItem.border,
        borderRadius: 24,
        backgroundColor: Colors.menuItem.background,
        padding: 6,
        paddingHorizontal: 6,
        gap: 12
    }
    
})