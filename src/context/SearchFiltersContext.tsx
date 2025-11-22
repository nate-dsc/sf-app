import { SearchFilters } from "@/types/Transactions"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"

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

function getLocalTodayRange() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0)
    return { yesterday, today }
}

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined)

export const SearchFiltersProvider = ({children}: {children: ReactNode}) => {
    const { yesterday, today } = getLocalTodayRange()

    const [filters, setFilters] = useState<SearchFilters>({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        dateFilterActive: false,
        initialDate: yesterday,
        finalDate: today,
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

    const resetFilters = () => updateFilters({
        textSearch: "",
        category: [],
        minValue: undefined,
        maxValue: undefined,
        type: "all",
    })

    const resetDates = () => {
        const { yesterday, today } = getLocalTodayRange()
        updateFilters({
            initialDate: yesterday,
            finalDate: today,
            dateFilterActive: false,
        })
    }

    const resetSorting = () => updateFilters({
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
