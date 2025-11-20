import { FontStyles } from "@/components/styles/FontStyles"
import { light } from "@/styles/colors"
import { CustomTheme } from "@/types/theme"
import React, { createContext, useContext, useMemo } from "react"
import { StyleSheet, TextStyle } from "react-native"

export type PaletteColorName = keyof typeof light.colors

export type HeaderConfig = {
    headerColor: PaletteColorName,
    titleColor: PaletteColorName,
    titleStyle: TextStyle,
    isModal?: boolean,
}

const defaultConfig: HeaderConfig = {
    headerColor: "indigo",
    titleColor: "white",
    titleStyle: StyleSheet.flatten(FontStyles.headline),
    isModal: false,
}

const headerConfigByRoute: Record<string, Partial<HeaderConfig>> = {
    settings: { headerColor: "blue" },
    settingsDatabase: { headerColor: "blue" },
    settingsDatabaseTable: { headerColor: "blue" },
    "(recurring)/incomeRecurring": { headerColor: "green" },
    "(recurring)/expenseRecurring": { headerColor: "red" },
    "(budget)/budget": { headerColor: "indigo" },
    "(budget)/budgetEdit": { headerColor: "gray6", titleColor: "black", isModal: true },
    distribution: { headerColor: "purple" },
    planPurchase: { headerColor: "orange" },
    next12Months: { headerColor: "indigo" },
    retirement: { headerColor: "cyan" },
    "(credit)/credit": { headerColor: "brown" },
    "(credit)/[cardId]": { headerColor: "brown" },
    "(credit)/addCreditCard": { headerColor: "gray6", titleColor: "black", isModal: true },
    "(credit)/modalAddInstallmentPurchase": { headerColor: "gray6", titleColor: "black", isModal: true },
    "(credit)/cardPurchases": { headerColor: "gray6", titleColor: "black", isModal: true },
    modalAdd: { headerColor: "gray6", titleColor: "black", isModal: true },
    modalRecurring: { headerColor: "gray6", titleColor: "black", isModal: true },
    modalCategoryPicker: { headerColor: "gray6", titleColor: "black", isModal: true },
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
        ...value
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
    const headerTitleColor = headerConfig.isModal ? theme.text.label : theme.colors[headerConfig.titleColor]
    const headerBackgroundColor = headerConfig.isModal ? undefined : theme.colors[headerConfig.headerColor]

    return {
        headerTitleAlign: "center" as const,
        headerShadowVisible: false,
        headerTransparent: headerConfig.isModal ? false : true,
        headerStyle: headerConfig.isModal ? undefined : { backgroundColor: headerBackgroundColor },
        headerTitleStyle: {
            ...headerConfig.titleStyle,
            color: headerTitleColor,
        },
        headerTintColor: headerTitleColor,
    }
}
