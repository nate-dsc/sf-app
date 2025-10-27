import { useStyle } from "@/context/StyleContext";
import { Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
    label: string,
    onPress: () => void,
    disabled?: boolean
}

export default function PrimaryButton({label, onPress, disabled = false}: PrimaryButtonProps) {

    const {theme} = useStyle()

    return(
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingVertical: 13,
                backgroundColor: disabled ? theme.buttons.primary.bgDisabled : theme.buttons.primary.bg
            }}
        >
            <Text
                style={{
                    lineHeight: 22,
                    fontSize: 17,
                    fontWeight: "500",
                    color: disabled ? theme.buttons.primary.labelDisabled : theme.buttons.primary.label
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
    
}