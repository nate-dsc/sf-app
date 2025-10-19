import { createContext, ReactNode, useContext, useMemo, useState } from "react"

export type TransactionTypeFilter = "inflow" | "outflow" | "all"
export type FilterOrderBy = "dateasc" | "datedesc" | "valueasc" | "valuedesc"

type SearchFilters = {
    textSearch?: string,
    category?: number[],
    minValue?: number,
    maxValue?: number,
    orderBy?: FilterOrderBy,
    type?: TransactionTypeFilter
}

type SearchFiltersContextType = {
    filters: SearchFilters,
    setFilters: (filters: SearchFilters) => void,
    updateFilters: (updates: Partial<SearchFilters>) => void
    resetFilters: () => void
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined)

export const SearchFiltersProvider = ({children}: {children: ReactNode}) => {
    const [filters, setFilters] = useState<SearchFilters>({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        orderBy: "datedesc",
        type: "all"
    })

    const updateFilters = (updates: Partial<SearchFilters>) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...updates
        }))
    }

    const resetFilters = () => setFilters({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        orderBy: "datedesc",
        type: "all",
    })

    const value = useMemo(() => ({
        filters,
        setFilters,
        updateFilters,
        resetFilters
    }), [filters]);

    return(
        <SearchFiltersContext.Provider value={value}>
            {children}
        </SearchFiltersContext.Provider>
    )
}

export const useSearchFilters = () => {
    const context = useContext(SearchFiltersContext)
    if (context === undefined) {
        throw new Error("useSearchFilters must be used within a SearchFiltersProvider")
    }

    return context
}
