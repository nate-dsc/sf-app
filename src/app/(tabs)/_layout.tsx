import CustomTabBar from "@/components/navigation/TabBar";
import { FontStyles } from "@/components/styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";


export default function TabBar() {

    const { t } = useTranslation()

    const {theme, preference, setPreference} = useTheme()

    const router = useRouter()

    return(
        <NavigationThemeProvider value={theme.navigationTheme}>
            <Tabs
                screenOptions={({route}) => ({
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTitleStyle: FontStyles.title2,
                    headerRight: () =>
                    (
                        <TouchableOpacity
                            style={{ height: 44, paddingRight: 14, justifyContent: "center", backgroundColor: theme.colors.blue }}
                            onPress={() => router.push("/settings")}
                        >
                            <Ionicons name="cog" size={30} color={theme.navigationTheme.colors.text} />
                        </TouchableOpacity>
                    ),
                })}
                tabBar={(props) => <CustomTabBar {...props}/>}
            >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: t("nav.home"),
                        }}
                    />
                    <Tabs.Screen
                        name="history"
                        options={{
                            title: t("nav.history")
                        }}
                    />
                    <Tabs.Screen
                        name="planning"
                        options={{
                            headerShown: false
                        }}
                    />  
            </Tabs>
        </NavigationThemeProvider>
    )
}