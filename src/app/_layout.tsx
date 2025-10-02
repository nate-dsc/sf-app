import { FontStyles } from "@/components/styles/FontStyles"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

 function RootLayoutNav() {
    const theme = useTheme()

    return(
        <NavigationThemeProvider value={theme.navigationTheme}>
                <SafeAreaProvider>
                        <StatusBar style={"auto"}/>
                        <Stack screenOptions={{
                            headerShadowVisible: false,
                            headerTransparent: true,
                            headerTitleStyle: FontStyles.title2}}>
                            <Stack.Screen
                                name="(tabs)"
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="settings"
                                options={{
                                    headerBackButtonDisplayMode: "minimal",
                                    headerBackButtonMenuEnabled: false,
                                    headerBackTitle: "Start",
                                    title: "Settings"
                                }}
                            />
                            <Stack.Screen
                                name="modalAdd"
                                options={{
                                    headerBackButtonDisplayMode: "minimal",
                                    title: "New transaction",
                                    presentation: "formSheet"
                                }}
                            />
                            <Stack.Screen
                                name="modalRecurring"
                                options={{
                                    headerBackButtonDisplayMode: "minimal",
                                    headerBackButtonMenuEnabled: false,
                                    title: "Recurring",
                                    presentation: "formSheet"
                                }}
                            />
                            <Stack.Screen
                                name="modalCategoryPicker"
                                options={{
                                    headerBackButtonDisplayMode: "minimal",
                                    headerBackButtonMenuEnabled: false,
                                    title: "Pick a category",
                                    presentation: "formSheet"
                                }}
                            />
                            <Stack.Screen
                                name="experiment"
                                options={{
                                    headerBackButtonDisplayMode: "minimal",
                                    headerBackButtonMenuEnabled: false,
                                    title: "Experimentation"
                                }}
                            />
                        </Stack>
                </SafeAreaProvider>
        </NavigationThemeProvider>
    )
}

export default function RootLayout()
{
    return(
        <ThemeProvider>
            <RootLayoutNav />
        </ThemeProvider>
    )
}