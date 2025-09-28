import { StyleSheet } from "react-native"

export const FontStyles = StyleSheet.create({
    mainTitle: {
        fontWeight: "bold",
        fontSize: 24
    },
    mainTitleLight: {
        fontSize: 24,
        fontWeight: "400"
    },
    secondaryTitle: {
        fontWeight: "400",
        fontSize: 20
    },
    secondaryBody: {
        fontWeight: "400",
        fontSize: 18
    },
    mainNumDisplay: {
        fontVariant: ["tabular-nums"],
        fontSize: 22,
        fontWeight: "bold"
    },
    mainNumDisplayLight: {
        fontVariant: ["tabular-nums"],
        fontSize: 22,
        fontWeight: "600"
    },
    secondaryNumDisplay: {
        fontVariant: ["tabular-nums"],
        fontSize: 18
    }
})