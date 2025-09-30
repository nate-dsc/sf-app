import { DarkTheme, DefaultTheme } from "@react-navigation/native"

type CustomTheme = {
  navigationTheme: typeof DefaultTheme,
  custom: {
    background: string,
    tileBackground: string,

    text: string,
    textUnfocused: string,

    gray: string,
    lightGray: string,
    grayerGray: string,

    red: string,
    green: string,
    blue: string,
  },
  menuItem: {
    background: string,
    border: string,
    text: string,
    unfocusedText: string,
    icons: string,
    tint: string
  }
}

type NavigationColors = {
    dark: boolean,
    colors: {
        primary: string,                   
        background: string,                
        card: string,                         
        text: string,                         
        border: string,                    
        notification: string
    }

}

type CustomColors = {
    background: string,
    tileBackground: string,
    textUnfocused: string,
    menuItemBackground: string,
    gray: string,
    lightGray: string,
    grayerGray: string,
    red: string,
    green: string,
    blue: string,
}

export const light: CustomTheme = {
  navigationTheme: {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#007AFF",                   
      background: "#F2F2F2",                
      card: "#FFF",                         
      text: "#000",                         
      border: "#E0E0E0",                    
      notification: "#FF3B30",              
    },
  },
  custom: {
    background: "#F2F2F2",
    tileBackground: "#FFF",

    text: "#000",
    textUnfocused: "#808080",

    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4",

    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
  },
  menuItem: {
    background: "#E0E0E0",
    border: "#E0E0E0",
    text: "#000",
    unfocusedText: "#808080",
    icons: "#000",
    tint: "#007AFF"
  }
}

export const dark: CustomTheme = {
  navigationTheme: {
    ...DarkTheme,
    dark: true,
    colors: {
      primary: "#007AFF",
      background: "#000",
      card: "#202020",
      text: "#FFF",
      border: "#808080",
      notification: "#FF3B30",
    },
  },
  custom: {
    background: "#F2F2F2",
    tileBackground: "#202020",

    text: "#F5F5F5",
    textUnfocused: "#E0E0E0",

    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4",

    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
  },

  menuItem: {
    background: "#181818",
    border: "#2E2E2E",
    text: "#F5F5F5",
    unfocusedText: "#C7C7C7",
    icons: "#F5F5F5",
    tint: "#007AFF"
  }
}