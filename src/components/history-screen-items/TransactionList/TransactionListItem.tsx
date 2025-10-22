import { TileStyles } from "@/components/home-screen-items/TileStyles";
import { FontStyles } from "@/components/styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";
import { Transaction } from "@/database/useTransactionDatabase";
import { findCategoryByID } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

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
            <View 
                style={{
                    backgroundColor: theme.background.group.secondaryBg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    borderCurve: "continuous",
                    marginBottom: 12
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15,
                        paddingTop: 7
                    }}
                >
                    <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                    <Text 
                        style={{fontSize: 15, lineHeight: 25, color: theme.text.secondaryLabel}}
                    >
                        {timestampedYMDtoLocaleDateWithoutYear(item.date) || ""}
                    </Text>
                </View>

                <View style={{paddingHorizontal: 15}}>
                    <Text style={[{textAlign: "right", color: theme.text.label}, FontStyles.numTitle1]}>{valueStr}</Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15,
                        paddingBottom: 7
                    }}
                >
                    <Text 
                        style={[
                            {textAlign: "justify", fontStyle: "italic", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Sobre: {item.description || ""}
                    </Text>
                </View>
                
                

            </View>
        </Pressable>
    )
}