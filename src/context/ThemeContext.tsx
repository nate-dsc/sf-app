import { dark, light } from "@/constants/Colors";
import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext(light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? dark : light;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
