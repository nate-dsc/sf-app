import CreditCardForm, { CreditCardFormValues } from "@/components/credit-card-items/CreditCardForm"
import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { NewCard } from "@/types/Transactions"
import { useRouter } from "expo-router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function AddCardModal() {
    const { t } = useTranslation()
    const router = useRouter()
    const { createCard, getCards } = useTransactionDatabase()

    const handleValidate = useCallback(async (values: CreditCardFormValues) => {
        const cards = await getCards()
        const normalizedName = values.name.trim().toLowerCase()

        const duplicatedName = cards.some((card) => card.name.trim().toLowerCase() === normalizedName)
        if (duplicatedName) {
            return t("credit.errors.duplicateName", { defaultValue: "Já existe um cartão com este nome." })
        }

        const duplicatedLimit = cards.some((card) => card.maxLimit === values.maxLimit)
        if (duplicatedLimit) {
            return t("credit.errors.duplicateLimit", { defaultValue: "Já existe um cartão com este limite." })
        }

        return null
    }, [getCards, t])

    const handleSubmit = useCallback(async (values: CreditCardFormValues) => {
        const newCard: NewCard = {
            name: values.name,
            color: values.color,
            maxLimit: values.maxLimit,
            closingDay: values.closingDay,
            dueDay: values.dueDay,
            ignoreWeekends: values.ignoreWeekends,
        }

        await createCard(newCard)
        router.back()
    }, [createCard, router])

    return (
        <CreditCardForm
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            onValidate={handleValidate}
        />
    )
}
