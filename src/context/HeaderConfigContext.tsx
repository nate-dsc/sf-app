import { light } from "@/styles/colors"
import { CustomTheme } from "@/types/theme"
import React, { createContext, useContext, useMemo } from "react"
import { TextStyle } from "react-native"

export type PaletteColorName = keyof typeof light.colors

export type HeaderConfig = {
    headerBackgroundColor?: PaletteColorName,
    titleStyle: TextStyle,
}

const defaultConfig: HeaderConfig = {
    headerBackgroundColor: "indigo",
    titleStyle: {
        fontSize: 22, fontWeight: "600"
    },
}

const headerConfigByRoute: Record<string, Partial<HeaderConfig>> = {
    "(recurring)/incomeRecurring": { headerBackgroundColor: "green" },
    "(recurring)/expenseRecurring": { headerBackgroundColor: "red" },
    "(budget)/budget": { headerBackgroundColor: "indigo" },
    "(budget)/budgetEdit": { headerBackgroundColor: undefined },
    distribution: { headerBackgroundColor: "purple" },
    planPurchase: { headerBackgroundColor: "orange" },
    next12Months: { headerBackgroundColor: "indigo" },
    retirement: { headerBackgroundColor: "cyan" },
    "(credit)/credit": { headerBackgroundColor: "brown" },
    "(credit)/[cardId]": { headerBackgroundColor: "brown" },
    "(credit)/addCreditCard": { headerBackgroundColor: undefined },
    "(credit)/modalAddInstallmentPurchase": { headerBackgroundColor: undefined },
    "(credit)/cardPurchases": { headerBackgroundColor: undefined },
    modalAdd: { headerBackgroundColor: undefined },
    modalRecurring: { headerBackgroundColor: undefined },
    modalCategoryPicker: { headerBackgroundColor: undefined },
}

export const resolveHeaderConfig = (routeName?: string): HeaderConfig => {
    const routeConfig = routeName ? headerConfigByRoute[routeName] : undefined

    return {
        ...defaultConfig,
        ...routeConfig,
        titleStyle: {
            ...defaultConfig.titleStyle,
            ...(routeConfig?.titleStyle ?? {}),
        },
    }
}

const HeaderConfigContext = createContext<HeaderConfig>(defaultConfig)

export const HeaderConfigProvider = ({ children, value }: { children: React.ReactNode, value?: Partial<HeaderConfig> }) => {
    const mergedValue = useMemo(() => ({
        ...defaultConfig,
        ...value,
        titleStyle: {
            ...defaultConfig.titleStyle,
            ...(value?.titleStyle ?? {}),
        },
    }), [value])

    return (
        <HeaderConfigContext.Provider value={mergedValue}>
            {children}
        </HeaderConfigContext.Provider>
    );
};

export const useHeaderConfig = () => useContext(HeaderConfigContext);

export const getHeaderScreenOptions = (theme: CustomTheme, routeName?: string) => {
    const headerConfig = resolveHeaderConfig(routeName)
    const isModal = !headerConfig.headerBackgroundColor
    const headerTitleColor = isModal ? theme.text.label : theme.colors.white
    const headerBackgroundColor = headerConfig.headerBackgroundColor ? theme.colors[headerConfig.headerBackgroundColor] : undefined

    return {
        headerTitleAlign: "center" as const,
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: isModal ? undefined : { backgroundColor: headerBackgroundColor },
        headerTitleStyle: {
            ...headerConfig.titleStyle,
            color: headerTitleColor,
        },
        headerTintColor: headerTitleColor,
    }
}
