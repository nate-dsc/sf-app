import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function PlanningScreen() {

    const headerHeight = useHeaderHeight() + 10
    const router = useRouter()
    const {theme} = useTheme()

    return(
            <ScrollView contentContainerStyle={{flex: 1, paddingTop: 10, paddingBottom: 120, gap: 16}}>
                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Recorrentes </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 16, gap: 16}}
                        >
                            <LinkCard 
                                label="Despesas"
                                icon="card"
                                color={theme.colors.red}
                                onPress={() => router.push("/recurring")}
                            />
                            <LinkCard 
                                label="Renda"
                                icon="card"
                                color={theme.colors.green}
                                onPress={() => router.push("/recurring")}
                            />
                        </ScrollView>
                </View>

                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Controle </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 16, gap: 16}}
                        >
                            <LinkCard 
                                label="Orçamento"
                                icon="card"
                                color={theme.colors.yellow}
                                onPress={() => router.push("/recurring")}
                            />
                            <LinkCard 
                                label="Cartões de Crédito"
                                icon="card"
                                color={theme.colors.pink}
                                onPress={() => router.push("/recurring")}
                            />
                            <LinkCard 
                                label="Distribuição"
                                icon="card"
                                color={theme.colors.purple}
                                onPress={() => router.push("/recurring")}
                            />
                        </ScrollView>
                </View>

                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Futuro </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 16, gap: 16}}
                        >
                            <LinkCard 
                                label="Planejar compra"
                                icon="card"
                                color={theme.colors.orange}
                                onPress={() => router.push("/recurring")}
                            />
                            <LinkCard 
                                label="Próximos 12 meses"
                                icon="card"
                                color={theme.colors.indigo}
                                onPress={() => router.push("/recurring")}
                            />
                            <LinkCard 
                                label="Aposentadoria"
                                icon="card"
                                color={theme.colors.cyan}
                                onPress={() => router.push("/recurring")}
                            />
                        </ScrollView>
                </View>
            </ScrollView>
    )
}