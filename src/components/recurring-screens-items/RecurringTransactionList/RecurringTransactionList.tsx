// RecurringTransactionList.tsx
import { useState } from "react"
import { FlatList, View } from "react-native"

import { RecurringTransaction } from "@/types/transaction"
import TransactionListItem from "./RecurringTransactionListItem"

type RecurringTransactionListProps = {
    data: RecurringTransaction[],
    onItemPress: (item: RecurringTransaction) => void,
}

export default function RecurringTransactionList({ data, onItemPress}: RecurringTransactionListProps) {

    const [height, setHeight] = useState(0)

    const renderItem = ({ item }: { item: RecurringTransaction }) => (
        <TransactionListItem
            item={item}
            onItemPress={onItemPress}
            {...item}
        />
    )

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(event) => {
                const viewHeight = event.nativeEvent.layout.height
                setHeight(viewHeight)
            }}
        >
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: height * 0.05,
                    paddingBottom: 60,
                    gap: 16,
                }}
            />
        </View>
    )
}
