import { Transaction } from "@/database/useTransactionDatabase"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const CACHE_KEY = "@summary"

export type Summary = {
    inflowCurrentMonth: number,
    outflowCurrentMonth: number,
    lastTransaction: Transaction | null
}

type SummaryState = {
    data: Summary | null,
    error: string | null,
    loading: boolean,
    refreshKey: boolean,
    triggerRefresh: () => void,
    loadData: (dbFunctions: { getSummaryFromDB: () => Promise<Summary> }) => Promise<void>
}

export const useSummaryStore = create<SummaryState>()(
    persist(
        (set, get) => ({
            data: null,
            error: null,
            loading: false,

            refreshKey: false,
            triggerRefresh: () => set((state) => ({ refreshKey: !state.refreshKey })),
            
            loadData: async (dbFunctions) => {
                // CORREÇÃO: get() é uma função que retorna o estado
                if (!get().data) {
                    set({ loading: true, error: null });
                } else {
                    // Se já temos dados, ativamos o loading para indicar um refresh
                    set({ loading: true, error: null });
                }

                try {
                    // Chama a função passada como argumento
                    const freshData = await dbFunctions.getSummaryFromDB();
                    
                    // Atualiza o estado com os novos dados
                    set({ data: freshData, loading: false });

                } catch (error) {
                    console.error("Erro ao carregar dados no store:", error);
                    set({ error: "Não foi possível carregar os dados.", loading: false });
                }
            }
        }),
        {
            name: CACHE_KEY, // Nome da chave no AsyncStorage
            storage: createJSONStorage(() => AsyncStorage), // Define o motor de armazenamento
        }
    )
);