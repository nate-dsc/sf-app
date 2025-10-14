import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { TileStyles } from "./TileStyles"

export default function BudgetTile() {
    const { data, loading, error } = useSummaryStore()
    const { theme } = useTheme()
    const { t } = useTranslation()
    const tileStyles = TileStyles(theme)

    if (loading && !data) {
        return <ActivityIndicator size="large" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const balance = ((data?.inflowCurrentMonth ?? 0) - (data?.outflowCurrentMonth! ?? 0))/100
    const balanceStr = balance.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={tileStyles.container}>

            <Text style={[tileStyles.text, FontStyles.title2]}>{t("tiles.balanceThisMonth")}</Text>
            <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numLargeTitle]}>{balanceStr}</Text>
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={[tileStyles.textUnfocused, FontStyles.title3]}>of </Text>
                <Text style={[{textAlign: "right"}, tileStyles.textUnfocused, FontStyles.numTitle3]}>{balanceStr}</Text>
            </View>

        </View>
    )
}