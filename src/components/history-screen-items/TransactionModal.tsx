import { Transaction } from "@/database/useTransactionDatabase"
import { useTranslation } from "react-i18next"
import { Pressable, Text, View } from "react-native"
import { TileStyles } from "../home-screen-items/TileStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { FontStyles } from "../styles/FontStyles"
import { categoryIDtoIconName } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDate } from "@/utils/DateUtils";

type TransactionModalProps = {
    transaction: Transaction | null,
    onBackgroundPress: () => void,
}

export default function TransactionModal({transaction, onBackgroundPress}: TransactionModalProps) {

    if(!transaction) return null

    const {t} = useTranslation()
    const {theme} = useTheme()
    const tileStyles = TileStyles(theme)
    const value = transaction.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    return(
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "stretch", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 12}}
            onPress={onBackgroundPress}
        >
            <View style={{

                backgroundColor: theme.tile.background,
                borderWidth: 1,
                borderColor: theme.tile.border,
                paddingTop: 8,
                paddingBottom: 12,
                paddingHorizontal: 12,
                borderRadius: 24,
                borderCurve: "continuous",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 2 ,
                shadowOffset: {width: 0, height: 1}}}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                    <Ionicons size={25} name={categoryIDtoIconName(transaction.category)} color={value > 0 ? "#3ADD63" : "#FF3B30"}/>
                    <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numTitle2]}>{valueStr}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 20}}>
                    <Text 
                        style={[
                            {textAlign: "right"},
                            tileStyles.textUnfocused,
                            FontStyles.numSubhead
                        ]}
                    >{timestampedYMDtoLocaleDate(transaction.date) || ""}</Text>
                    <Text 
                        style={[
                            {textAlign: "right", fontStyle: "italic"},
                            tileStyles.textUnfocused,
                            FontStyles.subhead
                        ]}
                    >{transaction.description || ""}</Text>
                </View>
            </View>

        </Pressable>
    )    

}