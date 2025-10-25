import { light } from "@/styles/colors"
import { StyleSheet } from "react-native"

export const MIStyles = (Theme: typeof light) => StyleSheet.create({
    redir: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
    },
    datePicker: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
    },
    switch: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
    },
    stepper: {
        justifyContent: "center", 
        alignItems: "flex-start",
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
    },
    segment: {
        flex: 1,
        flexWrap: "nowrap",
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        //backgroundColor: Theme.menuItem.background
        backgroundColor: Theme.background.group.secondaryBg
    },
    activeSegment: {
        flex: 1,
        flexWrap: "nowrap",
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        //backgroundColor: Theme.menuItem.tint
        backgroundColor: Theme.colors.blue

    },
    listItemCheckmark: {
       color: Theme.menuItem.tint
    },
    listPickerSeparator: {
        height: StyleSheet.hairlineWidth,
        //marginLeft: 50,
        //marginRight: 50,
        backgroundColor: Theme.menuItem.separator 
    },
    dayPicker: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderRadius: 20,
        backgroundColor: Theme.menuItem.background,
    },
    dayPickerRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
        marginBottom: 6,
    },
    dayPickerRowLast: {
        marginBottom: 0,
    },
    dayPickerCell: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 6,
    },
    dayPickerItem: {
        width: 38,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 999,
    },
    dayPickerSelectedItem: {
        backgroundColor: Theme.colors.blue,
    },
    dayPickerPaddingView: {
        flex: 1,
    },
    dayPickerTodayText: {
        color: Theme.colors.blue,
    },
    monthPicker: {
        aspectRatio: 8 / 3,
        width: "100%",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        overflow: "hidden",
        backgroundColor: Theme.menuItem.separator,
        gap: StyleSheet.hairlineWidth
    },
    monthPickerRow: {
        flex: 1,
        flexDirection: "row", 
        gap: StyleSheet.hairlineWidth, 
        justifyContent: "space-evenly"
    },
    monthPickerItem: {
        flex: 1,
        //aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        backgroundColor: Theme.menuItem.background,
    },
    monthPickerSelectedItem: {
        backgroundColor: Theme.menuItem.tint,
    },
    monthPickerPaddingView: {
        flex: 1,
        backgroundColor: Theme.menuItem.background
    },



    //Text and icon Theme
    text: {
        //color: Theme.menuItem.text
        color: Theme.text.label
    },
    textUnfocused: {
        //color: Theme.menuItem.textUnfocused
        color: Theme.text.secondaryLabel
    },
    textInverted: {
        color: Theme.menuItem.textInverted
    },
    textOverTint :{
        color: Theme.menuItem.textOverTint
    },
    icon: {
        color: Theme.menuItem.icons,
    },
    iconUnfocused: {
        color: Theme.menuItem.textUnfocused
    },
    iconInverted: {
        color: Theme.menuItem.textInverted
    },
    iconOverTint: {
        color: Theme.menuItem.textOverTint
    },


    //Containers
    stepperTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "flex-start", 
        alignItems: "center",
        padding: 12
    },
    stepperContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center", 
        alignItems: "center",
    },
    leftContainer: {
        //paddingLeft: 8,
        marginLeft:8,
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "teal"
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
        //borderColor: Theme.menuItem.border,
        borderColor: Theme.background.group.tertiaryBg,
        borderRadius: 24,
        //backgroundColor: Theme.menuItem.background,
        backgroundColor: Theme.background.group.secondaryBg,
        padding: 6,
        paddingHorizontal: 6,
        gap: 12
    },
    listPickerContainer: {
        flexGrow: 0,
        backgroundColor: Theme.menuItem.background,
        borderWidth: 1,
        borderColor: Theme.menuItem.border,
        borderRadius: 24,
        overflow: "hidden"
    }
    
})