import { useTheme } from "@/context/ThemeContext";
import { Transaction } from "@/database/useTransactionDatabase";
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
        <View>
            <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numTitle3]}>{valueStr}</Text>
            <Text 
                style={[
                    {textAlign: "right", fontStyle: "italic"},
                    tileStyles.textUnfocused,
                    FontStyles.subhead
                ]}
            >{item.date || ""}</Text>
            <Text 
                style={[
                    {textAlign: "right", fontStyle: "italic"},
                    tileStyles.textUnfocused,
                    FontStyles.subhead
                ]}
            >{item.description || ""}</Text>
        </View>
    )
}