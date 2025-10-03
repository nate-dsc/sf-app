import { FontStyles } from "@/components/styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabBar() {

    const theme = useTheme()

    const router = useRouter()

    return(
        <NavigationThemeProvider value={theme.theme.navigationTheme}>
            <Tabs screenOptions={({route}) => ({
                headerShadowVisible: false,
                headerTransparent: true,
                headerTitleStyle: FontStyles.title2,
                headerRight: () =>
                (
                    <TouchableOpacity
                    style={{ marginRight: 25 }}
                    onPress={() => router.push("/settings")}
                    >
                    <Ionicons name="settings-outline" size={27} color={theme.theme.navigationTheme.colors.text} />
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
        </NavigationThemeProvider>
    )
}