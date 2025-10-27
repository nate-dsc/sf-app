import { useStyle } from "@/context/StyleContext";
import { Text, TouchableOpacity } from "react-native";

type LabeledButtonProps = {
    label: string,
    onPress: () => void,
    disabled?: boolean,
    tinted?: boolean
}

export default function LabeledButton({label, onPress, disabled = false, tinted = false}: LabeledButtonProps) {

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
                backgroundColor: theme.fill.tertiary
            }}
        >
            <Text
                style={{
                    lineHeight: 22,
                    fontSize: 17,
                    fontWeight: "500",
                    color: disabled ? theme.text.tertiaryLabel : tinted ? theme.colors.blue : theme.text.label
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
    
}