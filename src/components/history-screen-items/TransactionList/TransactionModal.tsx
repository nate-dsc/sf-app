import DeleteButton from "@/components/buttons/DeleteButton"
import RecurringLinkButton from "@/components/buttons/RecurringLinkButton"
import ReturnButton from "@/components/buttons/ReturnButton"
import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Transaction, useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { timestampedYMDtoLocaleDate } from "@/utils/DateUtils"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, View } from "react-native"

type TransactionModalProps = {
    transaction: Transaction | null,
    onBackgroundPress: () => void,
}

export default function TransactionModal({transaction, onBackgroundPress}: TransactionModalProps) {

    if(!transaction) return null

    const {t} = useTranslation()
    const {theme} = useTheme()
    const value = transaction.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})
    const {triggerRefresh} = useSummaryStore()

    const category = findCategoryByID(transaction.category)

    const { deleteTransaction } = useTransactionDatabase()

    const handleDeletion = async (id: number) => {
        try {
            await deleteTransaction(transaction.id);
            onBackgroundPress(); // Só volta se salvar com sucesso
            triggerRefresh()
        } catch (error) {
            console.log("Falha ao deletar. Tente novamente.");
        }
    }

    return(
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "stretch", paddingHorizontal: 12, gap: 10}}
            onPress={onBackgroundPress}
        >
            <BlurView
                style={StyleSheet.absoluteFill}
                intensity={10}
                tint="default"
            />
            <View style={{
                rowGap: 12,
                backgroundColor: theme.background.group.secondaryBg,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                padding: 15,
                borderRadius: 30,
                borderCurve: "continuous",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 32 ,
                shadowOffset: {width: 0, height: 0}}}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                        <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                        <Text
                            style={[
                                FontStyles.subhead,
                                {paddingHorizontal: 12, lineHeight: 25, color: theme.text.secondaryLabel}
                            ]}
                        >{category.label}</Text>
                    </View>
                    <Text 
                        style={[
                            FontStyles.subhead,
                            {lineHeight: 25, color: theme.text.secondaryLabel}
                        ]}
                    >{timestampedYMDtoLocaleDate(transaction.date) || ""}</Text>
                </View>
                <Text 
                    style={[
                        {textAlign: "right", color: theme.text.label},
                        FontStyles.numLargeTitle
                    ]}
                >{valueStr}</Text>
                <View>
                    <Text
                        style={[
                            {textAlign: "left", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                    >Sobre essa transação:</Text>
                    <Text 
                        style={[
                            {textAlign: "justify", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                    >{transaction.description || ""}</Text>
                </View>
                <View>
                    <Text
                        style={[
                            {textAlign: "left", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                    >ID recorrencia:</Text>
                    <Text 
                        style={[
                            {textAlign: "justify", color: theme.text.secondaryLabel},
                            FontStyles.subhead
                        ]}
                    >{transaction.id_recurring || ""}</Text>
                </View>
                
            </View>
            <View style={{flexDirection: "row", flexWrap: "wrap", justifyContent: "center", columnGap: 36, marginHorizontal: 36}}>
                <View style={{}}>
                    <DeleteButton onPress={() => handleDeletion(transaction.id)}/>
                </View>
                {transaction.id_recurring ? <RecurringLinkButton /> : null}
                <View style={{}}>
                    <ReturnButton styles={{borderRadius: 100}} onPress={onBackgroundPress}/>
                </View>
            </View>
            

        </Pressable>
    )    

}