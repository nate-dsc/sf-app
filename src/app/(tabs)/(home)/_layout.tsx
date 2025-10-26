import { AppIcon } from "@/components/AppIcon";
import { useStyle } from "@/context/StyleContext";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function HomeLayout() {

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
                headerRight: () => (
                    <TouchableOpacity
                        style={{width: 44, height: 44, paddingLeft: 4}}
                        onPress={() => router.push("/settings")}
                    >
                        <AppIcon
                            name={"gear"}
                            androidName={"settings"}
                            size={36}
                            tintColor={"rgba(255,255,255,0.7)"}
                        />
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