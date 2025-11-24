import { AppIcon } from "@/components/AppIcon";
import { useStyle } from "@/context/StyleContext";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export default function PlanningLayout() {

    const {t} = useTranslation()
    const {theme} = useStyle()
    const router = useRouter()

    return (
        <Stack 
            screenOptions={{
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerTransparent: true,
                //headerStyle: { backgroundColor: theme.navigation.headerBackground },
                headerTitleStyle: { fontSize: 22, fontWeight: "600"},
                headerRight: () => (
                    <Pressable
                        style={{width: 36, height: 36, justifyContent: "center", alignItems: "center"}}
                        onPress={() => router.push("/settings")}
                    >
                        <AppIcon
                            name={"gear"}
                            androidName={"settings"}
                            size={30}
                            tintColor={theme.text.label}
                        />
                    </Pressable>
                )
                
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