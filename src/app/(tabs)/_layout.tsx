import CustomTabBar from "@/components/navigation/TabBar";
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
                tabBar={(props) => <CustomTabBar {...props}/>}
            >
                    <Tabs.Screen
                        name="(home)"

                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.home.index")
                        }}
                    />
                    <Tabs.Screen
                        name="history"
                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.history.index")
                        }}
                    />
                    <Tabs.Screen
                        name="planning"
                        options={{
                            headerShown: false,
                            tabBarLabel: t("nav.planning.index")
                        }}
                    />  
            </Tabs>
        </NavigationThemeProvider>
    )
}