import { Flow, MonthlyCategoryAggregate } from "@/types/transaction"
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
    triggerRefresh: () => void
    loadData: (dbFunctions: { getMonthlyCategoryDistribution: () => Promise<MonthlyCategoryAggregate[]> }) => Promise<void>
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

export const useDistributionStore = create<DistributionStore>()((set, get) => ({
    data: null,
    error: null,
    loading: false,
    refreshKey: false,
    triggerRefresh: () => set((state) => ({ refreshKey: !state.refreshKey })),
    loadData: async ({ getMonthlyCategoryDistribution }) => {
        if (!get().data) {
            set({ loading: true, error: null })
        } else {
            set({ loading: true, error: null })
        }

        try {
            const aggregates = await getMonthlyCategoryDistribution()
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
