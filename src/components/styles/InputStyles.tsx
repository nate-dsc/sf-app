import { Colors } from "@/components/styles/Colors"
import { StyleSheet } from "react-native"

export const InputStyles = StyleSheet.create({
    smallInputField: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        //height: 40,
        borderRadius: 8,
        padding: 12
    },
    //For segmented control
    segmentContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
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
