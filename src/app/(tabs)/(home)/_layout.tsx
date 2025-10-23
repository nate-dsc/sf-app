import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function HomeLayout() {

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
                headerRight: () => (
                    <TouchableOpacity
                        style={{width: 44, height: 44, paddingLeft: 4}}
                        onPress={() => router.push("/settings")}
                    >
                        <Ionicons style={{}} name="cog" size={36} color={"rgba(255,255,255,0.7)"} />
                    </TouchableOpacity>
                )
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: t("nav.home.index")
                }}
            />
        </Stack>
    )
}