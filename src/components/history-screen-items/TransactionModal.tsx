import { Transaction } from "@/database/useTransactionDatabase"
import { Pressable, Text, View } from "react-native"

type TransactionModalProps = {
    transaction: Transaction | null,
    onBackgroundPress: () => void,
}

export default function TransactionModal({transaction, onBackgroundPress}: TransactionModalProps) {

    if(!transaction) return null

    return(
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)"}}
            onPress={onBackgroundPress}
        >
            <View style={{backgroundColor: "white", width: "50%", height: "50%"}}>
                <Text> Esse é o modal de transação </Text>
                <Text>ID: {transaction.id}</Text>
                <Text>Value: {transaction.value}</Text>
                <Text>Date: {transaction.date}</Text>
                <Text>Description: {transaction.description}</Text>
                <Text>Category: {transaction.category}</Text>
            </View>

        </Pressable>
    )    

}