import { dark, light } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark"
type Theme = typeof light

interface ThemeContextType {
  theme: Theme,
  preference: ThemePreference,
  setPreference: (p: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: light,
  preference: "system",
  setPreference: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme()
  const [preference, setPreference] = useState<ThemePreference>("system")

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

  const theme = preference === "system" ? (systemScheme === "dark" ? dark : light) : (preference === "dark" ? dark : light)
  /*
  Preferência é sistema? Se sim e o tema atual do sistema for dark, theme = dark, do contrário theme = light.
  Se a preferência não for o sistema, mas for "dark", então theme = dark, do contrário theme = light.
  */

  return (
    <ThemeContext.Provider value={{theme, preference, setPreference}}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
