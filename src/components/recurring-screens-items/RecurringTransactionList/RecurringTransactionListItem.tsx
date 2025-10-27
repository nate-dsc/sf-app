import { FontStyles } from "@/components/styles/FontStyles";
import { useStyle } from "@/context/StyleContext";
import { RecurringTransaction } from "@/types/transaction";
import { findCategoryByID } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

type TransactionListItemProps = {
    item: RecurringTransaction,
    onItemPress: (item: RecurringTransaction) => void,
}

export default function RecurringTransactionListItem({item, onItemPress}: TransactionListItemProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()
    const value = item.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    const category = findCategoryByID(item.category, t)


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
                        {timestampedYMDtoLocaleDateWithoutYear(item.date_start) || ""}
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