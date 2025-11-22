import { NewTransaction } from "@/context/NewTransactionContext";
import { InstallmentPurchase } from "@/types/CreditCards";
import { RecurringTransaction, Transaction } from "@/types/Transactions";

export function formatAsTransaction(data: NewTransaction): Transaction {

}

export function formatAsRecurringTransaction(data: NewTransaction): RecurringTransaction {

}

export function formatAsInstallmentPurchase(data: NewTransaction): InstallmentPurchase {
    
}