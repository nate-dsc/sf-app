import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const TabBarStyles = (Colors: typeof light) => StyleSheet.create({
    tabBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        
        borderCurve: "continuous",
        borderRadius: 40,
        borderWidth: 1,

        backgroundColor: Colors.navigation.tabBarBackground,
        borderColor: Colors.navigation.tabBarBorder,

        shadowColor: "black",
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.15,

    }
})