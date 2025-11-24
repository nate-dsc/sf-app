import { useStyle } from "@/context/StyleContext"
import { ReactNode } from "react"
import { View, ViewStyle } from "react-native"

type BaseViewProps = {
    children?: ReactNode,
    style?: ViewStyle,
}

export default function BaseView({ children, style}: BaseViewProps) {
    const { theme } = useStyle()

    return (
        <View
            style={[{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 26,
                borderCurve: "continuous",
                backgroundColor: theme.background.group.secondaryBg,
                overflow: "hidden"
            }, style]}
        >
            {children}
        </View>
    )
}

//theme.fill.secondary