import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { ReactNode } from "react"
import { Text, View } from "react-native"

export type PlanningFeaturePlaceholderProps = {
    icon: ReactNode,
    title: string,
    description: string,
    highlights?: string[],
}

export default function PlanningFeaturePlaceholder({ icon, title, description, highlights }: PlanningFeaturePlaceholderProps) {
    const { theme } = useStyle()

    return (
        <View
            style={{
                backgroundColor: theme.background.group.secondaryBg,
                borderRadius: 24,
                padding: 24,
                gap: 20,
            }}
        >
            <View style={{ alignItems: "center", gap: 12 }}>
                <View
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        backgroundColor: theme.fill.quaternary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </View>
                <Text style={[FontStyles.title2, { color: theme.text.label, textAlign: "center" }]}>
                    {title}
                </Text>
            </View>

            <Text style={{ color: theme.text.secondaryLabel, fontSize: 16, lineHeight: 22, textAlign: "center" }}>
                {description}
            </Text>

            {Array.isArray(highlights) && highlights.length > 0 && (
                <View style={{ gap: 12 }}>
                    {highlights.map((item, index) => (
                        <View key={`highlight-${index}`} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                            <View
                                style={{
                                    marginTop: 7,
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: theme.colors.blue,
                                }}
                            />
                            <Text style={{ color: theme.text.label, flex: 1, fontSize: 15, lineHeight: 21 }}>
                                {item}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}
