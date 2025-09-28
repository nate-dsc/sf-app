import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

type AddButtonProps = {
    size?: number,
    onPress: () => void
}

export default function AddButton({ size=40, onPress }: AddButtonProps) {

    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size/2
    }
    
    return(
        <TouchableOpacity style={[styles.button, buttonSize]} onPress={onPress} >
            <Ionicons name="add" size={size} color={"#fff"}/>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    button: {
        zIndex: 1,
        backgroundColor: "#14ea00ff",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    }
})