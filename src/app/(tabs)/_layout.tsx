import { FontStyles } from "@/components/styles/FontStyles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabBar() {

    const router = useRouter()

    return(
        <Tabs screenOptions={({route}) => ({
            headerShadowVisible: false,
            headerTransparent: true,
            headerTitleStyle: FontStyles.title2,
            headerRight: () =>
             (
                <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => router.push("/settings")}
                >
                <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
            )
        })}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                }}
            />
            <Tabs.Screen
                name="planning"
                options={{
                    title: "Planning",
                }}
            />
            
        </Tabs>
    )
}