import { useStyle } from "@/context/StyleContext"
import { ReactNode } from "react"
import { Text, View } from "react-native"

type EmptyViewProps = {
    icon: ReactNode,
    title: string,
    subtitle: string
}

export default function EmptyView({icon, title, subtitle}: EmptyViewProps) {

    const {theme} = useStyle()

    return(
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 16
            }}
        >
            {icon}
            <View style={{gap: 4}}>
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "600",
                        color: theme.text.label,
                        textAlign: "center"
                    }}
                    maxFontSizeMultiplier={2}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "500",
                        color: theme.text.secondaryLabel,
                        textAlign: "center"
                    }}
                    maxFontSizeMultiplier={2}
                >
                    {subtitle}
                </Text>
            </View>
        </View>
    )

}