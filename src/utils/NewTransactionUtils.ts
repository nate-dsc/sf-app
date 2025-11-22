import { NewTransaction } from "@/context/NewTransactionContext";
import { InstallmentPurchase } from "@/types/CreditCards";
import { RecurringTransaction, Transaction } from "@/types/Transactions";

export function formatAsTransaction(data: NewTransaction): Transaction {
    return {
        id: 0,
        value: data.type === "in" ? data.value! : -data.value!,
        description: data.description || "",
        category: data.category!,
        date: data.date?.toISOString().slice(0, 16)!,
        card_id: data.cardId ?? null,
        type: data.type ?? "out",
    }
}

export function formatAsRecurringTransaction(data: NewTransaction): RecurringTransaction {
    return {
        id: 0,
        value: data.type === "in" ? data.value! : -data.value!,
        description: data.description || "",
        category: data.category!,
        date_start: data.date?.toISOString().slice(0, 16)!,
        rrule: data.rrule!,
        date_last_processed: null,
        card_id: data.cardId ?? null,
        type: data.type ?? "out",
        is_installment: 0
    }
}

export function formatAsInstallmentPurchase(data: NewTransaction): InstallmentPurchase {

    const installmentRRULE = `FREQ=MONTHLY;INTERVAL=1;COUNT=${data.installmentsCount}`

    return {
        transaction: {
            id: 0,
            value: -Math.abs(data.value!),
            description: data.description || "",
            category: data.category!,
            date_start: data.date?.toISOString().slice(0, 16)!,
            rrule: installmentRRULE,
            date_last_processed: null,
            card_id: data.cardId!,
            type: "out",
            is_installment: 1
        },
        installmentCount: data.installmentsCount!,
    }
}