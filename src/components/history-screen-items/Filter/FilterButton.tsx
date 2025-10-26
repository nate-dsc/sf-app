import { AppIcon } from "@/components/AppIcon";
import { useStyle } from "@/context/StyleContext";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type FilterButtonProps = TouchableOpacityProps & {
    isActive: boolean
}

export default function FilterButton({isActive, ...rest}: FilterButtonProps) {

    const {theme} = useStyle()

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
                name={"line.3.horizontal.decrease"}
                androidName={"filter-alt"} 
                size={26}
                tintColor={isActive ? theme.colors.blue : theme.text.secondaryLabel}
            />
        </TouchableOpacity>
    )
}