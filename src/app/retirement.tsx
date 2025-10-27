import { AppIcon } from "@/components/AppIcon"
import PlanningFeaturePlaceholder from "@/components/planning-screen-items/PlanningFeaturePlaceholder"
import { useStyle } from "@/context/StyleContext"
import { usePlanningScreenCopy } from "@/hooks/usePlanningScreenCopy"
import { useHeaderHeight } from "@react-navigation/elements"
import { ScrollView } from "react-native"

export default function RetirementScreen() {
    const headerHeight = useHeaderHeight()
    const { theme } = useStyle()
    const copy = usePlanningScreenCopy("retirement")

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.background.bg }}
            contentContainerStyle={{
                paddingTop: headerHeight + 24,
                paddingBottom: 48,
                paddingHorizontal: 24,
            }}
        >
            <PlanningFeaturePlaceholder
                icon={(
                    <AppIcon
                        name="beach.umbrella.fill"
                        androidName="beach-access"
                        size={40}
                        tintColor={theme.colors.cyan}
                    />
                )}
                {...copy}
            />
        </ScrollView>
    )
}
