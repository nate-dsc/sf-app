import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { RecurringTransaction } from "@/types/transaction"
import { findCategoryByID } from "@/utils/CategoryUtils"
import { timestampedYMDtoLocaleMonthShortDate } from "@/utils/DateUtils"
import { describeRRule } from "@/utils/RRULEUtils"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"

type RecurringTransactionModalProps = {
    transaction: RecurringTransaction | null,
    onBackgroundPress: () => void,
}

export default function RecurringTransactionModal({transaction, onBackgroundPress}: RecurringTransactionModalProps) {

    if(!transaction) return null

    const {t} = useTranslation()
    const {theme} = useTheme()
    const value = transaction.value/100
    const valueStr = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL", currencySign: "standard"})
    const {triggerRefresh} = useSummaryStore()

    const category = findCategoryByID(transaction.category)

    const { deleteRecurringTransaction, deleteRecurringTransactionCascade } = useTransactionDatabase()

    const showAlert = () => {
        Alert.alert(
        "Excluir transação recorrente", // Alert Title
        "Excluir uma transação recorrente não remove suas ocorrências passadas a não ser que escolha \"Excluir recorrência\".", // Alert Message
        [
            {
            text: "Excluir",
            onPress: () => handleDeletion(transaction.id),
            style: "destructive"
            },
            {
            text: "Excluir recorrência",
            onPress: () => handleCascadeDeletion(transaction.id),
            },
            {
            text: "Cancelar",
            style: "cancel" // Optional: gives a distinct style for cancel button on iOS
            }
        ],
        { cancelable: false } // Optional: prevents dismissing the alert by tapping outside
        );
    };


    const handleDeletion = async (id: number) => {
        try {
            await deleteRecurringTransaction(transaction.id);
            onBackgroundPress(); // Só volta se salvar com sucesso
            triggerRefresh()
        } catch (error) {
            console.log("Falha ao deletar. Tente novamente.");
        }
    }
    
    const handleCascadeDeletion = async (id: number) => {
        try {
            await deleteRecurringTransactionCascade(transaction.id);
            onBackgroundPress(); // Só volta se salvar com sucesso
            triggerRefresh()
        } catch (error) {
            console.log("Falha ao deletar em cascata. Tente novamente.");
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
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons size={25} name={category.iconName} color={value > 0 ? theme.colors.green : theme.colors.red}/>
                    </View>
                    
                    <Text 
                        style={[
                            {textAlign: "right", color: theme.text.label},
                            FontStyles.numLargeTitle
                        ]}
                    >
                        {valueStr}
                    </Text>

                    <View style={{paddingBottom: 14, paddingTop: 24}}>
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

                    <View style={{paddingBottom: 14}}>
                        <Text
                            style={[
                                {textAlign: "left", color: theme.text.secondaryLabel, paddingBottom: 6},
                                FontStyles.subhead
                            ]}
                        >
                            Iniciou em:
                        </Text>
                        <Text 
                            style={[
                                {textAlign: "justify", color: theme.text.secondaryLabel},
                                FontStyles.subhead
                            ]}
                        >
                            {timestampedYMDtoLocaleMonthShortDate(transaction.date_start)}
                        </Text>
                    </View>

                    
                    <View style={{paddingBottom: 24}}>
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
                        >{describeRRule(transaction.rrule, t)}</Text>
                    </View>
                    
                </View>

                <View 
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={showAlert}
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