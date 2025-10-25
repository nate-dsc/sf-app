import { dark, light } from "@/styles/colors";
import { Layout, LayoutBorderless } from "@/styles/layoutPresets";
import { CustomLayout, CustomTheme, LayoutType, ThemePreference } from "@/types/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

interface StyleContextType {
    theme: CustomTheme,
    layout: CustomLayout,
    preference: ThemePreference,
    layoutType: LayoutType,
    setPreference: (p: ThemePreference) => void,
    setLayout: (l: LayoutType) => void 
}

const StyleContext = createContext<StyleContextType>({
    theme: light,
    layout: Layout,
    preference: "system",
    layoutType: "normal",
    setPreference: () => {},
    setLayout: () => {}
})

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme()
    const [preference, setPreference] = useState<ThemePreference>("system")
    const [layoutType, setLayoutType] = useState<LayoutType>("normal")

    useEffect(() => {
        AsyncStorage.getItem("theme-preference").then((value) => {
        if (value === "system" || value === "light" || value === "dark") {
            setPreference(value);
        }
        });
    }, []);

    // Salvar sempre que mudar
    const setPreferenceState = (p: ThemePreference) => {
        setPreference(p);
        AsyncStorage.setItem("theme-preference", p);
    };

    const value = {
        theme: preference === "system" ? (systemScheme === "dark" ? dark : light) : (preference === "dark" ? dark : light),
        layout: layoutType === "normal" ? Layout : LayoutBorderless,
        preference: preference,
        layoutType: layoutType,
        setPreference: setPreferenceState,
        setLayout: setLayoutType
    }

    /*
    Preferência é sistema? Se sim e o tema atual do sistema for dark, theme = dark, do contrário theme = light.
    Se a preferência não for o sistema, mas for "dark", então theme = dark, do contrário theme = light.
    */

    return (
        <StyleContext.Provider
            value={value}
        >
            {children}
        </StyleContext.Provider>
    );
};

export const useStyle = () => useContext(StyleContext);
