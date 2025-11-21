// RecurringTransactionList.tsx
import { CCard } from "@/types/transaction"
import { useState } from "react"
import { FlatList, View } from "react-native"
import CCListItem from "./CreditCardListItem"

type CCListProps = {
    data: CCard[],
    onItemPress: (item: CCard) => void,
}

export default function CCList({data, onItemPress}: CCListProps) {

    const [height, setHeight] = useState(0)

    const renderItem = ({ item }: { item: CCard }) => (
        <CCListItem
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
