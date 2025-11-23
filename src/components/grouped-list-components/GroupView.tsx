import { useStyle } from "@/context/StyleContext"
import { ReactNode } from "react"
import { View } from "react-native"

type GroupViewProps = {
    children?: ReactNode
}

export default function GroupView({ children }: GroupViewProps) {
    const { theme } = useStyle();

    return (
        <View
            style={{
                borderRadius: 26,
                backgroundColor: theme.fill.secondary,
                overflow: "hidden"
            }}
        >
            {children}
        </View>
    )
}
