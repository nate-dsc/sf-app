import { useTheme } from "@/context/ThemeContext";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HistoryLayout() {

    const {t} = useTranslation()
    const {theme} = useTheme()
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
                    title: t("nav.history.index")
                }}
            />
        </Stack>
    )
}