import { light } from "@/styles/colors";
import React, { createContext, useContext, useMemo } from "react";
import { TextStyle } from "react-native";

export type PaletteColorName = keyof typeof light.colors;

export type HeaderConfig = {
    headerColor: PaletteColorName,
    titleColor: PaletteColorName,
    titleStyle: TextStyle
}

const defaultConfig: HeaderConfig = {
    headerColor: "blue",
    titleColor: "white",
    titleStyle: {}
}

const HeaderConfigContext = createContext<HeaderConfig>(defaultConfig);

export const HeaderConfigProvider = ({ children, value }: { children: React.ReactNode, value?: Partial<HeaderConfig> }) => {
    const mergedValue = useMemo(() => ({
        ...defaultConfig,
        ...value
    }), [value]);

    return (
        <HeaderConfigContext.Provider value={mergedValue}>
            {children}
        </HeaderConfigContext.Provider>
    );
};

export const useHeaderConfig = () => useContext(HeaderConfigContext);
