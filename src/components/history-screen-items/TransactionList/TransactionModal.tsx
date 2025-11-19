import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { Transaction } from "@/types/transaction"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { timestampedYMDtoLocaleDate } from "@/utils/DateUtils"
import { describeRRule } from "@/utils/RRULEUtils"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"

type TransactionModalProps = {
    transaction: Transaction | null,
    onBackgroundPress: () => void,
}

export default function TransactionModal({transaction, onBackgroundPress}: TransactionModalProps) {

    if(!transaction) return null

    const {t} = useTranslation()
    const {theme} = useStyle()
    const value = transaction!.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})
    const {triggerRefresh} = useSummaryStore()

    const [rruleDescription, setRruleDescription] = useState<string | null>(null)

    const category = findCategoryByID(transaction!.category, transaction.type)

    const { deleteTransaction, getRRULE } = useTransactionDatabase()

    const handleDeletion = async (id: number) => {
        try {
            await deleteTransaction(transaction!.id);
            onBackgroundPress(); // Só volta se salvar com sucesso
            triggerRefresh()
        } catch (error) {
            console.log("Falha ao deletar. Tente novamente.");
        }
    }

    useEffect(() => {
        setRruleDescription(null)
        if(transaction && transaction.id_recurring) {
            const fetchRruleDescription = async () => {
                try {
                    const rrule = await getRRULE(transaction.id_recurring!)
                    const description = describeRRule(rrule, t)
                    setRruleDescription(description)
                } catch(error) {
                    console.error("Falha ao buscar RRULE:", error)
                    setRruleDescription(null)
                }
            }

            fetchRruleDescription()
        }
    },[])

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
            <TouchableWithoutFeedback>
            <View 
                style={{
                    rowGap: 10,
                    backgroundColor: theme.background.group.secondaryBg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    padding: 13,
                    borderRadius: 34,
                    borderCurve: "continuous",
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 32,
                    shadowOffset: {width: 0, height: 0}
                }}
            >
                <View style={{paddingHorizontal: 10, paddingTop: 7}}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                        <Text 
                            style={{fontSize: 15, lineHeight: 25, color: theme.text.secondaryLabel}}
                        >
                            {timestampedYMDtoLocaleDate(transaction.date) || ""}
                        </Text>
                    </View>
                    
                    <Text 
                        style={[
                            {textAlign: "right", color: theme.text.label},
                            FontStyles.numLargeTitle
                        ]}
                    >
                        {valueStr}
                    </Text>

                    <View style={{paddingBottom: 14}}>
                        <Text
                            style={[
                                {textAlign: "left", color: theme.text.secondaryLabel, paddingBottom: 6},
                                FontStyles.subhead
                            ]}
                        >
                            Sobre essa transação:
                        </Text>
                        <Text 
                            style={[
                                {textAlign: "justify", color: theme.text.secondaryLabel},
                                FontStyles.subhead
                            ]}
                        >
                            {transaction.description || ""}
                        </Text>
                    </View>

                    {rruleDescription ?
                        <View style={{paddingBottom: 14}}>
                            <Text
                                style={[
                                    {textAlign: "left", color: theme.text.secondaryLabel, paddingBottom: 6},
                                    FontStyles.subhead
                                ]}
                            >Essa transação é recorrente com frequência:</Text>
                            <Text 
                                style={[
                                    {textAlign: "justify", color: theme.text.secondaryLabel},
                                    FontStyles.subhead
                                ]}
                            >{rruleDescription || ""}</Text>
                        </View> :
                        null
                    }
                    
                </View>

                <View 
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handleDeletion(transaction.id)}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                            paddingVertical: 13,
                            backgroundColor: theme.fill.secondary
                        }}
                    >
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.red}]}>Apagar</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity
                        onPress={onBackgroundPress}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                            paddingVertical: 13,
                            backgroundColor: theme.colors.blue
                        }}
                    >
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.white}]}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )    

}