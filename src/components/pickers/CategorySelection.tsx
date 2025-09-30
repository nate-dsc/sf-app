import { CategorySelectionStyles } from "@/components/styles/CategorySelectionStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"

type CategorySelectionProps = {
    options: string[],
    onSelection: (option: number) => void,
}

export default function CategorySelection({options, onSelection}: CategorySelectionProps) {

    const theme = useTheme()
    const styles = CategorySelectionStyles(theme)

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
