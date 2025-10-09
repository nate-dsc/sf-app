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
                    <Ionicons name="cog" size={30} color={theme.navigationTheme.colors.text} />
                    </TouchableOpacity>
                ),

                /* tabBarLabelStyle: {
                    fontSize: 12,
                    lineHeight: 16,
                    backgroundColor: "lightgreen"
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === "index") focused ? iconName = "home": iconName = "home-outline"
                    else if (route.name === "history") focused ? iconName = "list": iconName = "list-outline"
                    else if (route.name === "planning") focused ? iconName = "calendar": iconName = "calendar-outline"
                    else iconName = "help-outline"

                    return <Ionicons name={iconName} size={size} color={color} />;
                },

                tabBarIconStyle: {
                    backgroundColor: "#F5F5F5"
                },

                tabBarActiveTintColor: theme.menuItem.tint ,
                tabBarActiveBackgroundColor: "#F5F5F5",

                tabBarStyle: {
                    height: 70,
                    backgroundColor: theme.menuItem.background,
                    borderRadius: 35,
                    borderWidth: 1,
                    borderColor: theme.menuItem.border,
                    marginLeft: 20,
                    marginRight: 100,
                    position: "absolute",
                    bottom: 30
                },
                tabBarItemStyle:{
                    justifyContent: "center",
                    alignItems: "center"
                }, */
            })}
            
            tabBar={(props) => <CustomTabBar {...props}/>}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t("nav.home"),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: t("nav.history"),
                    }}
                />
                <Tabs.Screen
                    name="planning"
                    options={{
                        title: t("nav.planning"),
                    }}
                />
                
            </Tabs>
        </NavigationThemeProvider>
    )
}