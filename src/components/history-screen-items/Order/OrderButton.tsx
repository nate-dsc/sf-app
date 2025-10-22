import { useSearchFilters } from "@/context/SearchFiltersContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type OrderButtonProps = TouchableOpacityProps & {
    isActive: boolean
}

export default function DateButton({isActive, ...rest}: OrderButtonProps) {

    const {theme} = useTheme()
    const {filters} = useSearchFilters()

    return(
        <TouchableOpacity style={{
            width: 48,
            borderRadius: 100,
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.fill.tertiary
        }}
        {...rest}
        >
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Ionicons
                    size={26}
                    name={filters.orderBy === "desc" ? (filters.sortBy === "date"? "swap-vertical" : "arrow-down") : "arrow-up"}
                    color={isActive ? theme.colors.blue : theme.text.secondaryLabel}
                />
            </View>
            
        </TouchableOpacity>
    )
}