import { useTheme } from "@/context/ThemeContext"
import { Stack } from "expo-router"
import { useTranslation } from "react-i18next"

export default function CreditLayout() {

    const {theme} = useTheme()
    const {t} = useTranslation()

    return(
        <Stack 
            screenOptions={{
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerTransparent: true,
                headerTitleStyle: { fontSize: 18, fontWeight: "600", color: theme.colors.white }
            }}
        >
            {/* Tela principal */}
            <Stack.Screen
                name="index"
                options={{
                    title: t("nav.credit.index"),
                    headerBackButtonDisplayMode: "minimal",
                    headerBackButtonMenuEnabled: false,
                    headerBackTitle: t("nav.planning.index"),
                    headerStyle: { backgroundColor: theme.colors.brown }
                }}
            />
            {/* Telas de cartões de crédito */}
            <Stack.Screen
                name="cards/[cardId]"
                options={{
                    title: t("nav.credit.index"),
                    headerBackButtonDisplayMode: "minimal",
                    headerBackButtonMenuEnabled: false,
                    headerBackTitle: t("nav.planning.index"),
                    headerStyle: { backgroundColor: theme.colors.brown }
                }}
            />
            {/* Modal */}
            <Stack.Screen
                name="addCreditCard"
                options={{
                    title: t("nav.newTransaction"),
                    presentation: "formSheet",
                    contentStyle: {
                        backgroundColor: theme.background.group.secondaryBg
                    }
                }}
            />
            
        </Stack>
    )
}