import { AppIcon } from "@/components/AppIcon";
import { useSearchFilters } from "@/context/SearchFiltersContext";
import { useStyle } from "@/context/StyleContext";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type OrderButtonProps = TouchableOpacityProps & {
    isActive: boolean
}

export default function DateButton({isActive, ...rest}: OrderButtonProps) {

    const {theme} = useStyle()
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
            <AppIcon
                name={filters.orderBy === "desc" ? (filters.sortBy === "date"? "arrow.up.arrow.down" : "arrow.down") : "arrow.up"}
                androidName={filters.orderBy === "desc" ? (filters.sortBy === "date"? "swap-vert" : "arrow-downward") : "arrow-upward"} 
                size={26}
                tintColor={isActive ? theme.colors.blue : theme.text.secondaryLabel}
            />
        </TouchableOpacity>
    )
}