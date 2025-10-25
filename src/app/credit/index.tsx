import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function CreditScreen() {

    const router = useRouter()
    const {theme} = useTheme()

    return(
            <ScrollView contentContainerStyle={{paddingTop: useHeaderHeight(), paddingBottom: 120, gap: 16}}>
                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Recorrentes </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                gap: 16
                            }}
                        >
                            <View style={{flex: 1}}>
                                <LinkCard 
                                    label="Adicionar Cartão"
                                    icon="card"
                                    color={theme.colors.green}
                                    onPress={() => router.push("/credit/addCreditCard")}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <LinkCard 
                                    label="Vazio"
                                    icon="card"
                                    color={theme.colors.red}
                                    onPress={() => {}}
                                />
                            </View>
                        </View>
                </View>
            </ScrollView>
    )
}