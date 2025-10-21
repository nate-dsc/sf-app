import { createContext, ReactNode, useContext, useMemo, useState } from "react"

export type TransactionTypeFilter = "inflow" | "outflow" | "all"
export type FilterSortBy = "date" | "value"
export type FilterOrderBy = "asc" | "desc"

export type SearchFilters = {
    textSearch?: string,
    category?: number[],
    minValue?: number,
    maxValue?: number,
    initialDate?: Date,
    finalDate?: Date,
    sortBy?: FilterSortBy,
    orderBy?: FilterOrderBy,
    type?: TransactionTypeFilter
}

type SearchFiltersContextType = {
    filters: SearchFilters,
    setFilters: (filters: SearchFilters) => void,
    updateFilters: (updates: Partial<SearchFilters>) => void
    resetFilters: () => void,
    resetDates:  () => void,
    resetSorting:  () => void,
    filtersActive: boolean,
    sortActive: boolean
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined)

export const SearchFiltersProvider = ({children}: {children: ReactNode}) => {
    const [filters, setFilters] = useState<SearchFilters>({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        initialDate: new Date(),
        finalDate: new Date(),
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
        type: "all",
    })

    const resetDates = () => setFilters({
        initialDate: new Date(),
        finalDate: new Date()
    })

    const resetSorting = () => setFilters({
        sortBy: "date",
        orderBy: "desc"
    })

    const filtersActive = useMemo(() => {
        return(Boolean(
            (filters.category && filters.category.length > 0) ||
            filters.maxValue !== undefined ||
            filters.minValue !== undefined
        ))
    }, [filters])

    const sortActive = useMemo(() => {
        return(Boolean(
            filters.sortBy !== "date" ||
            filters.orderBy !== "desc"
        ))
    },[filters])

    const value = useMemo(() => ({
        filters,
        setFilters,
        updateFilters,
        resetFilters,
        resetSorting,
        resetDates,
        filtersActive,
        sortActive
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
