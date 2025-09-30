import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const TileStyles = (Colors: typeof light) => StyleSheet.create({
    container: {
        backgroundColor: Colors.custom.tileBackground,
        padding: 12,
        paddingTop: 8,
        borderRadius: 12,
        shadowOpacity: 0.15,
        shadowOffset: {width: 2, height: 2}
    },
    text: {
        color: Colors.custom.text
    }
})