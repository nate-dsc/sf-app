import { AppIcon } from "@/components/AppIcon";
import NewTabBar from "@/components/navigation/NewTabBar";
import { FontStyles } from "@/components/styles/FontStyles";
import { useStyle } from "@/context/StyleContext";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";


export default function TabBar() {

    const { t } = useTranslation()

    const {theme, preference, setPreference} = useStyle()

    const router = useRouter()

    return(
        <NavigationThemeProvider value={theme.navigationTheme}>
            <Tabs
                screenOptions={{
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTitleStyle: FontStyles.title2,
                }}
                //tabBar={(props) => <CustomTabBar {...props}/>}
                tabBar={(props) => <NewTabBar {...props}/>}
            >
                    <Tabs.Screen
                        name="(home)"

                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.home.index"),
                            tabBarIcon: ({ focused, color, size }) => {
                                return(
                                    <AppIcon
                                        name={focused ? "house.fill" : "house"}
                                        androidName={"home"}
                                        size={size}
                                        tintColor={color}
                                    />
                                )
                            },
                            tabBarActiveTintColor: theme.colors.white,
                            tabBarInactiveTintColor: theme.text.secondaryLabel,
                        }}
                    />
                    <Tabs.Screen
                        name="history"
                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.history.index"),
                            tabBarIcon: ({ focused, color, size }) => {
                                return(
                                    <AppIcon
                                        name={"list.bullet"}
                                        androidName={"list"}
                                        size={size}
                                        tintColor={color}
                                    />
                                )
                            },
                            tabBarActiveTintColor: theme.colors.white,
                            tabBarInactiveTintColor: theme.text.secondaryLabel,
                        }}
                    />
                    <Tabs.Screen
                        name="planning"
                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.planning.index"),
                            
                            tabBarIcon: ({ focused, color, size }) => {
                                return(
                                    <AppIcon
                                        name={"calendar"}
                                        androidName={"calendar-today"}
                                        size={size}
                                        tintColor={color}
                                    />
                                )
                            },
                            tabBarActiveTintColor: theme.colors.white,
                            tabBarInactiveTintColor: theme.text.secondaryLabel,
                        }}
                    />
            </Tabs>
        </NavigationThemeProvider>
    )
}