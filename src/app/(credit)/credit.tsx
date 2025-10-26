import { AppIcon } from "@/components/AppIcon"
import CreditCardCarousel from "@/components/credit-card-items/CreditCardCarousel"
import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { CCard } from "@/types/transaction"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"

export default function CreditScreen() {

    const router = useRouter()
    const {theme, layout} = useStyle()
    const {t} = useTranslation()

    const { getCards } = useTransactionDatabase()
    const [cards, setCards] = useState<CCard[]>([])
    const [selectedCard, setSelectedCard] = useState<CCard| null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCards() {
            try {
                const result = await getCards()
                setCards(result)
            } catch (error) {
                console.log("Erro ao carregar cartões:", error)
            } finally {
                setLoading(false)
            }
        }

        loadCards()
    }, [])
    

    return(
            <ScrollView 
                contentContainerStyle={{
                    paddingTop: useHeaderHeight() + layout.margin.contentArea,
                    paddingHorizontal: layout.margin.contentArea,
                    paddingBottom: 120,
                    gap: layout.margin.sectionGap
                }}
            >
                <View>
                    <Text
                        style={[
                            FontStyles.title3,
                            {color: theme.text.label,
                            paddingHorizontal: layout.margin.contentArea}
                        ]}
                    >
                        Recorrentes
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        gap: layout.margin.sectionGap
                    }}
                >
                    <View style={{flex: 1}}>
                        <LinkCard 
                            label={t("credit.add")}
                            icon={
                                <AppIcon
                                    name={"plus.circle"}
                                    androidName={"add-card"}
                                    size={40}
                                    tintColor={theme.colors.white}
                                />
                            }
                            color={theme.colors.green}
                            onPress={() => router.push("/(credit)/addCreditCard")}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <LinkCard 
                            label="Vazio"
                            icon={
                                <AppIcon
                                    name={"plus.circle"}
                                    androidName={"add-card"}
                                    size={40}
                                    tintColor={theme.colors.white}
                                />
                            }
                            color={theme.colors.red}
                            onPress={() => {}}
                        />
                    </View>
                </View>
                
                <View>
                {loading ? (
                    <Text style={{color: theme.text.secondaryLabel}}>Carregando cartões...</Text>
                ) : (
                    <CreditCardCarousel
                        cards={cards}
                        selectedCard={selectedCard}
                        onSelectCard={(card) => setSelectedCard(card)}
                    />
                )}
            </View>

            </ScrollView>
    )
}