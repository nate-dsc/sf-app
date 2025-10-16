import { useTheme } from "@/context/ThemeContext";
import { Transaction } from "@/database/useTransactionDatabase";
import { findCategoryByID } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { TileStyles } from "../home-screen-items/TileStyles";
import { FontStyles } from "../styles/FontStyles";

type TransactionListItemProps = {
    item: Transaction,
    onItemPress: (item: Transaction) => void,
}

export default function TransactionListItem({item, onItemPress}: TransactionListItemProps) {

    const {t} = useTranslation()
    const {theme} = useTheme()
    const tileStyles = TileStyles(theme)
    const value = item.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    const category = findCategoryByID(item.category)


    return(
        <Pressable onPress={() => onItemPress(item)}>
        <View style={[tileStyles.container, {marginBottom: 12, paddingBottom: 6}]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Ionicons size={25} name={category.iconName} color={value > 0 ? "#3ADD63" : "#FF3B30"}/>
                <Text 
                    style={[
                        tileStyles.textUnfocused,
                        FontStyles.subhead,
                        {lineHeight: 25}
                    ]}
                >{timestampedYMDtoLocaleDateWithoutYear(item.date) || ""}</Text>
            </View>
            <Text style={[{textAlign: "right"}, tileStyles.text, FontStyles.numTitle1]}>{valueStr}</Text>
            <Text 
                style={[
                    {textAlign: "justify", fontStyle: "italic"},
                    tileStyles.textUnfocused,
                    FontStyles.subhead
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >Sobre: {item.description || ""}</Text>

        </View>
        </Pressable>
    )
}