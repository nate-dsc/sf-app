import { DarkTheme, DefaultTheme } from "@react-navigation/native"

type CustomTheme = {
  navigationTheme: typeof DefaultTheme,
  custom: {
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
    textUnfocused: "#808080",
    menuItemBackground: "#E0E0E0",
    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4",
    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
  },
};

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
    textUnfocused: "#E0E0E0",
    menuItemBackground: "#808080",
    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4",
    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
  },
};


/* export const light = {
    background: "#F2F2F2",
    tileBackground: "#FFF",
    text: "#000",
    textUnfocused: "#808080",
    menuItemBackground: "#E0E0E0",

    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4"
}

export const dark = {
    background: "#000",
    tileBackground: "#202020",
    text: "#FFF",
    textUnfocused: "#E0E0E0",
    menuItemBackground: "#808080",

    red: "#FF3B30",
    green: "#34C759",
    blue: "#007AFF",
    gray: "#C7C7CC",
    lightGray: "#E0E0E0",
    grayerGray: "#D3D3D4"
} */