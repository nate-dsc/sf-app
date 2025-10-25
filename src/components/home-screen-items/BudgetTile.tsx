import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Text, View } from "react-native"
import { TileStyles } from "./TileStyles"

export default function BudgetTile() {
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

    const balance = ((data?.inflowCurrentMonth ?? 0) - (data?.outflowCurrentMonth! ?? 0))/100
    const balanceStr = balance.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    {t("tiles.balanceThisMonth")}
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
                <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numLargeTitle]}>{balanceStr}</Text>
                <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                    <Text style={[tileStyles.textUnfocused, FontStyles.body]}>of </Text>
                    <Text style={[{textAlign: "right"}, tileStyles.textUnfocused, FontStyles.numBody]}>{balanceStr}</Text>
                </View>
            </View>
        </View>
    )
}