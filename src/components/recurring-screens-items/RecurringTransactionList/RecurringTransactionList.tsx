// RecurringTransactionList.tsx
import { TransactionRecurring } from "@/database/useTransactionDatabase"
import { FlatList } from "react-native"
import TransactionListItem from "./RecurringTransactionListItem"

type RecurringTransactionListProps = {
    data: TransactionRecurring[]
    onItemPress: (item: TransactionRecurring) => void
}

export default function RecurringTransactionList({ data, onItemPress }: RecurringTransactionListProps) {

    const renderItem = ({ item }: { item: TransactionRecurring }) => (
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
