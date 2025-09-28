import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function RootLayout() {
    return(
        <SafeAreaProvider>
                <StatusBar style={"auto"}/>
                <Stack screenOptions={{
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTitleStyle: {
                        fontWeight: "bold"
                    }}}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false 
                        }}
                    />
                    <Stack.Screen
                        name="settings"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            title: "Settings"
                        }}
                    />
                    <Stack.Screen
                        name="addmodal"
                        options={{
                            headerBackButtonDisplayMode: "minimal",
                            headerBackButtonMenuEnabled: false,
                            title: "New transaction",
                            presentation: "formSheet"
                        }}
                    />
                </Stack>
        </SafeAreaProvider>
    )
}