import { createContext, ReactNode, useContext, useMemo, useState } from "react"

export type TransactionTypeFilter = "inflow" | "outflow" | "all"
export type FilterSortBy = "date" | "value"
export type FilterOrderBy = "asc" | "desc"

export type SearchFilters = {
    textSearch?: string,
    category?: number[],
    minValue?: number,
    maxValue?: number,
    sortBy?: FilterSortBy,
    orderBy?: FilterOrderBy,
    type?: TransactionTypeFilter
}

type SearchFiltersContextType = {
    filters: SearchFilters,
    setFilters: (filters: SearchFilters) => void,
    updateFilters: (updates: Partial<SearchFilters>) => void
    resetFilters: () => void,
    filtersActive: boolean,
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined)

export const SearchFiltersProvider = ({children}: {children: ReactNode}) => {
    const [filters, setFilters] = useState<SearchFilters>({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        sortBy: "date",
        orderBy: "desc",
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
        sortBy: "date",
        orderBy: "desc",
        type: "all",
    })

    const filtersActive = useMemo(() => {
        return(Boolean(
            (filters.category && filters.category.length > 0) ||
            filters.maxValue !== undefined ||
            filters.minValue !== undefined ||
            filters.sortBy !== "date" ||
            filters.orderBy !== "desc"
        ))
    }, [filters])

    const value = useMemo(() => ({
        filters,
        setFilters,
        updateFilters,
        resetFilters,
        filtersActive
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
