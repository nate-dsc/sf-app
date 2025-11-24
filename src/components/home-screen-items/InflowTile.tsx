import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { FONT_SIZE } from "@/styles/Fonts"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import BaseView from "../BaseView"

export default function InflowTile() {
    const { data, loading, error } = useSummaryStore()
    const { theme } = useStyle()
    const { t } = useTranslation()

    if (loading && !data) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }


    const inflow = (data?.inflowCurrentMonth ?? 0)/100
    const inflowStr = inflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text
                    style={{
                        fontSize: FONT_SIZE.TITLE3,
                        color: theme.text.label
                    }}
                >
                    {t("tiles.income")}
                </Text>
            </View>
            <BaseView>
                <Text
                    style={{
                        textAlign: "right",
                        fontSize: FONT_SIZE.TITLE3,
                        fontVariant: ["tabular-nums"],
                        color: theme.text.label
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {inflowStr}
                </Text>
            </BaseView>
        </View>
    )
}
