import { AppIcon } from "@/components/AppIcon"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE } from "@/styles/Fonts"
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
                    <Text
                        style={{
                            fontSize: FONT_SIZE.TITLE3,
                            color: theme.text.label,
                            paddingHorizontal: 32
                        }}
                    >
                        Cartões de crédito
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingHorizontal: 16,
                            gap: 16
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <LinkCard
                                label={"Adicionar cartão"}
                                icon={
                                    <AppIcon
                                        name={"plus.circle"}
                                        androidName={"add-card"}
                                        size={40}
                                        tintColor={theme.colors.white}
                                    />
                                }
                                color={theme.colors.green}
                                onPress={() => router.push("/(credit)/modalAddCreditCard")}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <LinkCard 
                                label="Carteira"
                                icon={
                                    <AppIcon
                                        name={"creditcard.fill"}
                                        androidName={"credit-card"}
                                        size={40}
                                        tintColor={theme.colors.white}
                                    />
                                }
                                color={theme.colors.mint}
                                onPress={() => router.push("/credit")}
                            />
                        </View>
                    </View>
                </View>

                <View style={{gap: 10}}>
                    <Text
                        style={{
                            fontSize: FONT_SIZE.TITLE3,
                            color: theme.text.label,
                            paddingHorizontal: 32
                        }}
                    >
                        Controle
                    </Text>
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
                                        name={"chart.bar.doc.horizontal.fill"}
                                        androidName={"leaderboard"}
                                        size={40}
                                        tintColor={theme.colors.white}
                                    />
                                }
                                color={theme.colors.purple}
                                onPress={() => router.push("/distribution")}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <LinkCard
                                label="Orçamento"
                                icon={
                                    <AppIcon
                                        name={"dollarsign.gauge.chart.leftthird.topthird.rightthird"}
                                        androidName={"pie-chart"}
                                        size={40}
                                        tintColor={theme.colors.white}
                                    />
                                }
                                color={theme.colors.indigo}
                                onPress={() => router.push("/budget")}
                            />
                        </View>
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
                                            name={"cart.fill"}
                                            androidName={"shopping-cart"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.gray1}
                                    onPress={() => router.push("/planPurchase")}
                                />
                            </View>
                            <View style={{flex:1}}>
                                <LinkCard
                                    label="Próximos 12 meses"
                                    icon={
                                        <AppIcon
                                            name={"calendar.badge.clock"}
                                            androidName={"calendar-today"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.gray1}
                                    onPress={() => router.push("/next12Months")}
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
                                            name={"beach.umbrella.fill"}
                                            androidName={"beach-access"}
                                            size={40}
                                            tintColor={theme.colors.white}
                                        />
                                    }
                                    color={theme.colors.gray1}
                                    onPress={() => router.push("/retirement")}
                                />
                            </View>
                            <View style={{flex:1}}/>
                        </View>
                </View>
            </ScrollView>
    )
}