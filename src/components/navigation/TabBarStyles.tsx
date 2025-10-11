import { light } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const TabBarStyles = (Colors: typeof light) => StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        paddingBottom: 25, //fix para o gradiente
        bottom: 0,
        left: 0,
        right: 0,
        columnGap: 10 // distancia entre a barra e o botão +
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        gap: 6,
        padding: 6,
        
        borderCurve: "continuous", // hmm, deixa mais redondo
        borderRadius: 24,
        borderWidth: 1,

        backgroundColor: Colors.navigation.tabBarBackground,
        borderColor: Colors.navigation.tabBarBorder,

        shadowColor: "#3f3f3fff",
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.15,

    },
    tabBarHighlight: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1.15,
        padding: 6,
        borderRadius: 18,
        borderCurve: "continuous",
    }
})