import { useStyle } from "@/context/StyleContext";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function PlanningLayout() {

    const {t} = useTranslation()
    const {theme} = useStyle()
    const router = useRouter()

    return (
        <Stack 
            screenOptions={{
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: { backgroundColor: theme.navigation.headerBackground },
                headerTitleStyle: { fontSize: 22, fontWeight: "600", color: theme.navigation.headerText },
                
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: t("nav.planning.index")
                }}
            />
        </Stack>
    )
}