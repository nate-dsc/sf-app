import LinkCard from "@/components/planning-screen-items/LinkCard"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, View } from "react-native"

export default function CreditScreen() {

    const router = useRouter()
    const {theme, layout} = useStyle()
    const {t} = useTranslation()

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
                                    icon="add"
                                    color={theme.colors.green}
                                    onPress={() => router.push("/(credit)/addCreditCard")}
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
            </ScrollView>
    )
}