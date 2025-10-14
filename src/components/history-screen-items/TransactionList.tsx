import { Transaction } from "@/database/useTransactionDatabase";
import { useState } from "react";

type TransactionListProps = {
    onItemPress: (item: Transaction) => void,
}

export default function TransactionList({onItemPress}: TransactionListProps) {
    const [data, setData] = useState<Transaction[]>([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    
}