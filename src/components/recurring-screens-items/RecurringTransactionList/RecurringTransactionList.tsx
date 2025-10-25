// RecurringTransactionList.tsx
import { RecurringTransaction } from "@/types/transaction"
import { FlatList } from "react-native"
import TransactionListItem from "./RecurringTransactionListItem"

type RecurringTransactionListProps = {
    data: RecurringTransaction[]
    onItemPress: (item: RecurringTransaction) => void
}

export default function RecurringTransactionList({ data, onItemPress }: RecurringTransactionListProps) {

    const renderItem = ({ item }: { item: RecurringTransaction }) => (
        <TransactionListItem
        item={item}
        onItemPress={onItemPress}
        {...item}
        />
    )

    return (
        <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }}
        />
    )
}
