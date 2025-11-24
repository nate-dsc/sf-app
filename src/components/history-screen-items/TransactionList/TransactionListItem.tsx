import BaseView from "@/components/BaseView";
import { useStyle } from "@/context/StyleContext";
import { FONT_SIZE } from "@/styles/Fonts";
import { Transaction } from "@/types/Transactions";
import { findCategoryByID } from "@/utils/CategoryUtils";
import { timestampedYMDtoLocaleDateWithoutYear } from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type TransactionListItemProps = {
    item: Transaction,
    onItemPress: (item: Transaction) => void,
}

export default function TransactionListItem({item, onItemPress}: TransactionListItemProps) {
    const {theme} = useStyle()
    const value = item.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})

    const category = findCategoryByID(item.category, item.type)


    return(
        <Pressable onPress={() => onItemPress(item)}>
            <BaseView 
                style={{
                    marginBottom: 12
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                    <Text 
                        style={{
                            fontSize: FONT_SIZE.SUBHEAD,
                            color: theme.text.secondaryLabel
                        }}
                    >
                        {timestampedYMDtoLocaleDateWithoutYear(item.date) || ""}
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            textAlign: "right",
                            fontSize: FONT_SIZE.TITLE1,
                            fontVariant: ["tabular-nums"],
                            color: theme.text.label
                        }}
                    >
                        {valueStr}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Text 
                        style={{
                            textAlign: "justify",
                            fontSize: FONT_SIZE.SUBHEAD,
                            fontStyle: "italic",
                            color: theme.text.secondaryLabel
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Sobre: {item.description || ""}
                    </Text>
                </View>
                
                

            </BaseView>
        </Pressable>
    )
}