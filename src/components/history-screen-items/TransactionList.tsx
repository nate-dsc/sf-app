import { Transaction, TransactionFilterOptions, useTransactionDatabase } from "@/database/useTransactionDatabase";
import { useSummaryStore } from "@/stores/useSummaryStore";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import TransactionListItem from "./TransactionListItem";

type TransactionListProps = {
    filters: TransactionFilterOptions,
    onItemPress: (item: Transaction) => void,
}

const PAGE_SIZE = 15

export default function TransactionList({filters={type: "all", category: undefined}, onItemPress}: TransactionListProps) {
    const tabBarHeight = useBottomTabBarHeight()

    const {getPaginatedFilteredTransactions} = useTransactionDatabase()

    const [data, setData] = useState<Transaction[]>([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const refreshKey = useSummaryStore((state) => state.refreshKey)

    const loadData = useCallback(async (isInitialLoad = false) => {
        if(loading || (!isInitialLoad && !hasMore)) return

        setLoading(true)

        const currentPage = isInitialLoad ? 0 : page

        try {
            const newTransactions = await getPaginatedFilteredTransactions(currentPage, PAGE_SIZE, filters)

            if(isInitialLoad) {
                setData(newTransactions)
            } else {
                setData(prev => [...prev, ...newTransactions])
            }

            setPage(currentPage + 1)
            setHasMore(newTransactions.length === PAGE_SIZE)

        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, filters, getPaginatedFilteredTransactions])

    useEffect(() => {
        // When filters change, reset the list and load from page 1
        loadData(true);
    }, [filters, refreshKey]);

    const renderItem = ({item}: {item: Transaction}) => (
        <TransactionListItem item={item} onItemPress={onItemPress} {...item} />
    )

    return(
        <FlatList
            style={{paddingHorizontal: 12}}
            data={data}
            keyExtractor={(item: Transaction) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={() => loadData()} // Load more on scroll
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }}/> : null}
            contentContainerStyle={{paddingBottom: tabBarHeight + 16}}
        />
    )


}

function useTransactionStore(arg0: (state: any) => any) {
    throw new Error("Function not implemented.");
}
