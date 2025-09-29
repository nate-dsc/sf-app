import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../styles/Colors"
import { FontStyles } from "../styles/FontStyles"

type CategorySelectionProps = {
    options: string[],
    onSelection: (option: number) => void,
}

export default function CategorySelection({options, onSelection}: CategorySelectionProps) {

    const options2 = ["Home", "Food", "Groceries", "Transport", "Services", "Leisure", "Education", "Shopping", "Games", "Gambling",
        "Travel", "Pet", "Investment", "Health", "Emergency", "Other"]

    return(
        <View style={styles.container}>
            {options2.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onSelection(index)}
                    style={styles.categoryOption}
                >
                    <Ionicons name="home-outline" size={20} />
                    <Text style={[FontStyles.title3]}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: "60%",
        backgroundColor: Colors.gray,
        borderRadius:8,
        overflow: "hidden",
        gap: 1
    },
    categoryOption: {
        flexDirection: "row",
        columnGap: 16,
        backgroundColor: Colors.lightGray,
        padding: 8,
    }
})