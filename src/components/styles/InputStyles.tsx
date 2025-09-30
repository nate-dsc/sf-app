import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const InputStyles = (Colors: typeof light) => StyleSheet.create({
    smallInputField: {
        flex: 1,
        backgroundColor: Colors.menuItemBackground,
        borderRadius: 8,
        padding: 12
    },
    datePickerField: {
        flex: 1,
        backgroundColor: Colors.menuItemBackground,
        borderRadius: 8,
        padding: 12,
        paddingVertical: 6
    },
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.menuItemBackground,
        borderRadius: 8,
        height: 34,
        overflow: 'hidden',
    },
    segment: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeSegment: {
        backgroundColor: Colors.blue,
    },
    segmentText: {
        fontSize: 17,
        lineHeight: 22,
        color: Colors.blue,
    },
    activeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
})
