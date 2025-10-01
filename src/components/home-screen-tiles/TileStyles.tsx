import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const TileStyles = (Colors: typeof light) => StyleSheet.create({
    container: {
        backgroundColor: Colors.tile.background,
        borderWidth: 1,
        borderColor: Colors.tile.border,
        padding: 12,
        //paddingTop: 8,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 2 ,
        shadowOffset: {width: 0, height: 0}
    },
    text: {
        color: Colors.tile.text
    },
    textUnfocused: {
        color: Colors.tile.textUnfocused
    },
    icon: {
        color: Colors.tile.icons
    },
    iconUnfocused: {
        color: Colors.tile.textUnfocused
    }
})