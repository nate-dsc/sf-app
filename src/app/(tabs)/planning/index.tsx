import { useTheme } from "@/context/ThemeContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function PlanningScreen() {

    const headerHeight = useHeaderHeight() + 10
    const router = useRouter()
    const {theme} = useTheme()

    return(
            <ScrollView contentContainerStyle={{flex: 1, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 120}}>
                <View style={{flex: 1}}>
                    <Text> Planning screen </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/recurring")}
                        >
                            <View 
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 16,
                                    borderRadius: 100,
                                    backgroundColor: theme.colors.blue
                                }}
                            >
                                <Text style={{lineHeight: 22, fontSize: 17, fontWeight: 500, color: theme.colors.white}}> Transações recorrentes </Text>
                            </View>
                        </TouchableOpacity>
                </View>
            </ScrollView>
    )
}