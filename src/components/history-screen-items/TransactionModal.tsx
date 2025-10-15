import { Transaction } from "@/database/useTransactionDatabase"
import { Pressable, Text, View } from "react-native"

type TransactionModalProps = {
    transaction: Transaction,
    onBackgroundPress: () => void,
}

export default function TransactionModal({transaction, onBackgroundPress}: TransactionModalProps) {

    return(
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"}}
            onPress={onBackgroundPress}
        >
            <View style={{backgroundColor: "white", aspectRatio: 1}}>
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