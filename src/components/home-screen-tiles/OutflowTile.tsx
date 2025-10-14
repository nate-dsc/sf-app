import { useTheme } from "@/context/ThemeContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"

export default function OutflowTile() {
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

    const outflow = -(data?.outflowCurrentMonth ?? 0)/100
    const outflowStr = outflow.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={[tileStyles.container]}>
            <Text style={[tileStyles.text, FontStyles.title2]}>{t("tiles.expenses")}</Text>
            <Text style={[tileStyles.text, FontStyles.numTitle1]}>{outflowStr}</Text>
        </View>
    )
}