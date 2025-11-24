import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { FONT_SIZE } from "@/styles/Fonts"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import BaseView from "../BaseView"


export default function LastTransactionTile() {

    const { data, loading, error } = useSummaryStore()
    const { theme } = useStyle()
    const { t } = useTranslation()

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
        type: "out" as const,
    }

    const value = (transaction.value)/100

    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    const category = findCategoryByID(transaction.category, transaction.type)

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text
                    style={{
                        fontSize: FONT_SIZE.TITLE3,
                        color: theme.text.label
                    }}
                >
                    {t("tiles.lastTransaction")}
                </Text>
            </View>
            <BaseView>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                    <Text 
                        style={{
                            fontSize: FONT_SIZE.SUBHEAD,
                            color: theme.text.secondaryLabel
                        }}
                    >
                        {timestampedYMDtoLocaleDateWithoutYear(transaction.date.slice(0,16)) || ""}
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            textAlign: "right",
                            fontSize: FONT_SIZE.TITLE1,
                            fontVariant: ["tabular-nums"],
                            color: theme.text.label
                        }}
                    >
                        {valueStr}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text 
                        style={{
                            textAlign: "justify",
                            fontSize: FONT_SIZE.SUBHEAD,
                            fontStyle: "italic",
                            color: theme.text.secondaryLabel
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Sobre: {transaction.description || ""}
                    </Text>
                </View>
            </BaseView>
        </View>
    )

}