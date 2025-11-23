import { useStyle } from "@/context/StyleContext"
import { ReactNode } from "react"
import { View } from "react-native"

type GroupViewProps = {
    children?: ReactNode,
    forceHorizontalPadding?: boolean,
    bgType?: "overBackground" | "overElevatedBackground"
}

export default function GroupView({ children, forceHorizontalPadding = false, bgType = "overElevatedBackground" }: GroupViewProps) {
    const { theme } = useStyle();

    return (
        <View
            style={{
                paddingHorizontal: forceHorizontalPadding ? 16 : 0,
                borderRadius: 26,
                backgroundColor: bgType === "overBackground" ? theme.background.group.secondaryBg : theme.fill.secondary,
                overflow: "hidden"
            }}
        >
            {children}
        </View>
    )
}
