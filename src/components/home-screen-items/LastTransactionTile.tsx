import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


export default function LastTransactionTile() {

    const { data, loading, error } = useSummaryStore()
    const { theme } = useStyle()
    const { t } = useTranslation()
    const tileStyles = TileStyles(theme)

    if (loading && !data) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const transaction = data?.lastTransaction ?? {
        id: 0,
        value: 0,
        description: "",
        date: new Date().toISOString(),
        category: 0,
        flow: "outflow",
    }

    const value = (transaction.value)/100

    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    const category = findCategoryByID(transaction.category, t)

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    {t("tiles.lastTransaction")}
                </Text>
            </View>
            <View 
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    borderCurve: "continuous"
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15,
                        paddingTop: 7
                    }}
                >
                    <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                    <Text 
                        style={{fontSize: 15, lineHeight: 25, color: theme.text.secondaryLabel}}
                    >
                        {timestampedYMDtoLocaleDateWithoutYear(transaction.date.slice(0,16)) || ""}
                    </Text>
                </View>

                <View style={{paddingHorizontal: 15}}>
                    <Text style={[{textAlign: "right", color: theme.text.label}, FontStyles.numTitle1]}>{valueStr}</Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15,
                        paddingBottom: 7
                    }}
                >
                    <Text 
                        style={[
                            {textAlign: "justify", fontStyle: "italic", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Sobre: {transaction.description || ""}
                    </Text>
                </View>
            </View>
        </View>
    )

}