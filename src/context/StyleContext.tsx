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
    const [preference, setPreference] = useState<ThemePreference | null>(null)
    const [layoutType, setLayoutType] = useState<LayoutType>("normal")
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        let mounted = true

        AsyncStorage.getItem("theme-preference")
            .then((value) => {
                if (!mounted) {
                    return
                }

                if (value === "system" || value === "light" || value === "dark") {
                    setPreference(value)
                } else {
                    setPreference("system")
                }
                setHydrated(true)
            })
            .catch(() => {
                if (mounted) {
                    setPreference("system")
                    setHydrated(true)
                }
            })

        return () => {
            mounted = false
        }
    }, [])

    if (!hydrated) {
        return null
    }

    // Salvar sempre que mudar
    const setPreferenceState = (p: ThemePreference) => {
        setPreference(p)
        AsyncStorage.setItem("theme-preference", p)
    }

    const resolvedPreference = preference ?? "system"

    const value = {
        theme: resolvedPreference === "system" ? (systemScheme === "dark" ? dark : light) : (resolvedPreference === "dark" ? dark : light),
        layout: layoutType === "normal" ? Layout : LayoutBorderless,
        preference: resolvedPreference,
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
