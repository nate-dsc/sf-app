import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

type CloseButtonProps = {
    size?: number,
    onPress: () => void
}

export default function CloseButton({ size=40, onPress }: CloseButtonProps) {

    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size/3
    }
    
    return(
        <TouchableOpacity style={[styles.button, buttonSize]} onPress={onPress} >
            <Ionicons name="close-outline" size={size} color={"#fff"}/>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    button: {
        //zIndex: 1,
        backgroundColor: "#ff0000ff",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 10,
        right: 10
    }
})