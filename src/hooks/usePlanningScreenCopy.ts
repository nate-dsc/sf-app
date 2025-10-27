import { PlanningFeaturePlaceholderProps } from "@/components/planning-screen-items/PlanningFeaturePlaceholder"
import { useTranslation } from "react-i18next"

export type PlanningScreenCopy = Pick<PlanningFeaturePlaceholderProps, "title" | "description" | "highlights">

export function usePlanningScreenCopy(key: string): PlanningScreenCopy {
    const { t } = useTranslation()

    return t(`planningScreens.${key}`, {
        returnObjects: true,
    }) as PlanningScreenCopy
}
