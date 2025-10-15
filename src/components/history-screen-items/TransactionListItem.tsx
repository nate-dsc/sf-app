import { useTheme } from "@/context/ThemeContext";
import { Transaction } from "@/database/useTransactionDatabase";
import { categoryIDtoIconName } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDate } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { TileStyles } from "../home-screen-items/TileStyles";
import { FontStyles } from "../styles/FontStyles";

export default function TransactionListItem(item: Transaction) {

    const {t} = useTranslation()
    const {theme} = useTheme()
    const tileStyles = TileStyles(theme)
    const value = item.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})


    return(
        <View style={[tileStyles.container, {marginBottom: 12, rowGap: 12}]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <Ionicons size={25} name={categoryIDtoIconName(item.category)} color={value > 0 ? "#3ADD63" : "#FF3B30"}/>
                <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numTitle2]}>{valueStr}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 20}}>
                <Text 
                    style={[
                        {textAlign: "right"},
                        tileStyles.textUnfocused,
                        FontStyles.numSubhead
                    ]}
                >{timestampedYMDtoLocaleDate(item.date) || ""}</Text>
                <Text 
                    style={[
                        {textAlign: "right", fontStyle: "italic"},
                        tileStyles.textUnfocused,
                        FontStyles.subhead
                    ]}
                >{item.description || ""}</Text>
            </View>
        </View>
    )
}