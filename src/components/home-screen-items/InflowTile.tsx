import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"

export default function InflowTile() {
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


    const inflow = (data?.inflowCurrentMonth ?? 0)/100
    const inflowStr = inflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    {t("tiles.income")}
                </Text>
            </View>
            <View 
                style={{
                    backgroundColor: theme.background.elevated.bg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 15
                }}
            >
                <Text
                    style={[{textAlign: "right", color: theme.text.label}, FontStyles.numTitle1]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {inflowStr}
                </Text>
            </View>
        </View>
    )
}
