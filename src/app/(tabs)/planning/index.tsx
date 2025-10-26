import { AppIcon } from "@/components/AppIcon"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function PlanningScreen() {

    const router = useRouter()
    const {theme} = useStyle()

    return(
            <ScrollView contentContainerStyle={{paddingTop: 10, paddingBottom: 120, gap: 16}}>
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
                                    label="Receitas"
                                    icon={
                                        <AppIcon
                                            name={"banknote.fill"}
                                            androidName={"payments"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.green}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <LinkCard 
                                    label="Despesas"
                                    icon={
                                        <AppIcon
                                            name={"scroll.fill"}
                                            androidName={"receipt-long"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.red}
                                    onPress={() => router.push("/expenseRecurring")}
                                />
                            </View>
                        </View>
                </View>

                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Controle </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                gap: 16
                            }}
                        >
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Orçamento"
                                    icon={
                                        <AppIcon
                                            name={"plus.circle"}
                                            androidName={"add-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.yellow}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Cartões de Crédito"
                                    icon={
                                        <AppIcon
                                            name={"creditcard.fill"}
                                            androidName={"credit-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.pink}
                                    onPress={() => router.push("/credit")}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                gap: 16
                            }}
                        >
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Distribuição"
                                    icon={
                                        <AppIcon
                                            name={"plus.circle"}
                                            androidName={"add-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.purple}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                            <View style={{flex:1}}/>
                        </View>
                </View>

                <View style={{gap: 10}}>
                    <Text style={[FontStyles.title3, {color: theme.text.label, paddingHorizontal: 32}]}> Futuro </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                gap: 16
                            }}
                        >
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Planejar compra"
                                    icon={
                                        <AppIcon
                                            name={"plus.circle"}
                                            androidName={"add-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.orange}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Próximos 12 meses"
                                    icon={
                                        <AppIcon
                                            name={"plus.circle"}
                                            androidName={"add-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.indigo}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                gap: 16
                            }}
                        >
                            <View style={{flex:1}}>
                                <LinkCard 
                                    label="Aposentadoria"
                                    icon={
                                        <AppIcon
                                            name={"plus.circle"}
                                            androidName={"add-card"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.cyan}
                                    onPress={() => router.push("/incomeRecurring")}
                                />
                            </View>
                            <View style={{flex:1}}/>
                        </View>
                </View>
            </ScrollView>
    )
}