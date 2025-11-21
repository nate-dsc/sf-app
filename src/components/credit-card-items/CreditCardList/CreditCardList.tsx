// RecurringTransactionList.tsx
import { CCard } from "@/types/transaction"
import { View } from "react-native"
import CCListItem from "./CreditCardListItem"

type CCListProps = {
    data: CCard[],
    onItemPress: (item: CCard) => void,
}

export default function CCList({ data, onItemPress }: CCListProps) {
    return (
        <View style={{ flex: 1, gap: 16, paddingTop: 8, paddingBottom: 60 }}>
            {data.map((item) => (
                <CCListItem
                    key={item.id}
                    item={item}
                    onItemPress={onItemPress}
                    {...item}
                />
            ))}
        </View>
    )
}
