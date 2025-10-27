import { CategoryDistributionFilters, Flow, MonthlyCategoryAggregate } from "@/types/transaction"
import { create } from "zustand"

export type DistributionCategory = {
    categoryId: number
    name: string
    flow: Flow
    value: number
    percentage: number
    color: string | null
}

export type DistributionData = {
    inflowTotal: number
    outflowTotal: number
    inflow: DistributionCategory[]
    outflow: DistributionCategory[]
}

type DistributionStore = {
    data: DistributionData | null
    loading: boolean
    error: string | null
    refreshKey: boolean
    filters: CategoryDistributionFilters
    setFilters: (filters: CategoryDistributionFilters) => void
    triggerRefresh: () => void
    loadData: (params: {
        getMonthlyCategoryDistribution: (filters?: CategoryDistributionFilters) => Promise<MonthlyCategoryAggregate[]>
        filters?: CategoryDistributionFilters
    }) => Promise<void>
}

const normalizeFlow = (
    aggregates: MonthlyCategoryAggregate[],
    flow: Flow
): { total: number; entries: DistributionCategory[] } => {
    const validEntries = aggregates
        .map((aggregate) => ({
            ...aggregate,
            total: Number.isFinite(aggregate.total) ? aggregate.total : 0,
        }))
        .filter((aggregate) => aggregate.total > 0)

    const total = validEntries.reduce((sum, aggregate) => sum + aggregate.total, 0)

    const sorted = [...validEntries].sort((a, b) => b.total - a.total)

    const entries: DistributionCategory[] = sorted.map((aggregate) => ({
        categoryId: aggregate.categoryId,
        name: aggregate.name,
        flow,
        value: aggregate.total,
        percentage: total > 0 ? aggregate.total / total : 0,
        color: aggregate.color ?? null,
    }))

    return { total, entries }
}

const cloneFilters = (filters: CategoryDistributionFilters): CategoryDistributionFilters => ({
    ...filters,
    month: filters.month ? new Date(filters.month) : undefined,
})

export const useDistributionStore = create<DistributionStore>()((set, get) => ({
    data: null,
    error: null,
    loading: false,
    refreshKey: false,
    filters: { month: new Date() },
    setFilters: (filters) => {
        set({ filters: cloneFilters(filters) })
    },
    triggerRefresh: () => set((state) => ({ refreshKey: !state.refreshKey })),
    loadData: async ({ getMonthlyCategoryDistribution, filters }) => {
        const previousFilters = get().filters
        const normalizedFilters = cloneFilters({
            month: filters?.month ?? previousFilters.month ?? new Date(),
            flow: filters?.flow ?? previousFilters.flow,
        })

        if (!get().data) {
            set({ loading: true, error: null, filters: normalizedFilters })
        } else {
            set({ loading: true, error: null, filters: normalizedFilters })
        }

        try {
            const aggregates = await getMonthlyCategoryDistribution(normalizedFilters)
            const inflowAggregates = aggregates.filter((aggregate) => aggregate.flow === "inflow")
            const outflowAggregates = aggregates.filter((aggregate) => aggregate.flow === "outflow")

            const { total: inflowTotal, entries: inflow } = normalizeFlow(inflowAggregates, "inflow")
            const { total: outflowTotal, entries: outflow } = normalizeFlow(outflowAggregates, "outflow")

            set({
                data: {
                    inflowTotal,
                    outflowTotal,
                    inflow,
                    outflow,
                },
                loading: false,
                error: null,
            })
        } catch (error) {
            console.error("Erro ao carregar dados da distribuição:", error)
            set({ error: "Não foi possível carregar a distribuição.", loading: false })
        }
    },
}))
