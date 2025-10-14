import { useTheme } from "@/context/ThemeContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"
import { TileStyles } from "./TileStyles"


export default function LastTransactionTile() {

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

    const transaction = data?.lastTransaction ?? {value: 0, description: null, date: new Date().toISOString, category: 0}

    const value = (transaction.value)/100

    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={[tileStyles.container]}>
            <Text style={FontStyles.title3}>{t("tiles.lastTransaction")}</Text>
            <Text style={[{textAlign: "right"}, FontStyles.numTitle1]}>{valueStr}</Text>
            <Text style={[{textAlign: "right", fontStyle: "italic"}, tileStyles.textUnfocused, FontStyles.body]}>{transaction.description || ""}</Text>
        </View>
    )

}