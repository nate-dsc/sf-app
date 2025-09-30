import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const CategorySelectionStyles = (Colors: typeof light) => StyleSheet.create({
    container: {
        width: "60%",
        backgroundColor: Colors.background,
        borderRadius:8,
        overflow: "hidden",
        gap: 1
    },
    categoryOption: {
        flexDirection: "row",
        columnGap: 16,
        backgroundColor: Colors.menuItemBackground,
        padding: 8,
    }
})