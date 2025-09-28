import { StyleSheet } from "react-native"

export const InputStyles = StyleSheet.create({
    smallInputField: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        height: 34,
        borderRadius: 8,
        paddingHorizontal: 4
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
        backgroundColor: '#007AFF',
    },
    segmentText: {
        fontSize: 18,
        color: '#007AFF',
    },
    activeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
})
