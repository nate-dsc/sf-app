import { DarkTheme, DefaultTheme } from "@react-navigation/native"

const defaultTint = "#007AFF"

const defaultLightBackground = "#F8F8F8"
const defaultLightBorder = "#FFFFFF"

const defaultDarkBackground = "#181818"
const defaultDarkBorder = "#2E2E2E"

type CustomTheme = {
    navigationTheme: typeof DefaultTheme,
    navigation: {
        tabBarBackground: string,
        tabBarBorder: string,

        tabBarIconBackgroundFocused: string,
        tabBarIconFocused: string,
        tabBarLabelFocused: string,

        tabBarIconBackgroundUnfocused: string,
        tabBarIconUnfocused: string,
        tabBarLabelUnfocused: string,

        tabBarGradientStart: string,
    },
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
    tile: {
        background: string,
        border: string,
        text: string,
        textUnfocused: string,
        textInverted: string,
        icons: string,
        tint: string,
        positiveTint: string,
        negativeTint: string,
    },
    menuItem: {
        background: string,
        separator: string,
        border: string,
        text: string,
        textUnfocused: string,
        textInverted: string,
        textOverTint: string,
        icons: string,
        tint: string
    }
    themeName: string
}

export const light: CustomTheme = {
  navigationTheme: {
        ...DefaultTheme,
        dark: false,
        colors: {
        primary: "#007AFF",
        //background: "#F2F2F2",
        background: "#ebebebff",
        card: "#FFFFFF",
        text: "#000",
        border: "#E0E0E0",
        notification: "#FF3B30",
        },
    },
    navigation: {
        tabBarBackground: defaultLightBackground,
        tabBarBorder: defaultLightBorder,

        tabBarIconBackgroundFocused: defaultTint,
        tabBarIconFocused: "#F5F5F5",
        tabBarLabelFocused: "#F5F5F5",

        tabBarIconBackgroundUnfocused: defaultLightBackground,
        tabBarIconUnfocused: "#808080",
        tabBarLabelUnfocused: "#808080",

        tabBarGradientStart: "#FFFFFF00"
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
    tile: {
        background: "#f8f8f8",
        border: "#FFFFFF",
        text: "#000",
        textUnfocused: "#808080",
        textInverted: "#F5F5F5",
        icons: "#000",
        tint: "#007AFF",
        positiveTint: "#34C759",
        negativeTint: "#FF3B30"
    },
    menuItem: {
        background: "#E0E0E0",
        separator: "#bbbabaff",
        border: "#E0E0E0",
        text: "#000",
        textUnfocused: "#808080",
        textInverted: "#F5F5F5",
        textOverTint: "#F5F5F5",
        icons: "#000",
        tint: "#007AFF"
    },
    themeName: "light"
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
    navigation: {
        tabBarBackground: defaultDarkBackground,
        tabBarBorder: defaultDarkBorder,

        tabBarIconBackgroundFocused: defaultTint,
        tabBarIconFocused: "#F5F5F5",
        tabBarLabelFocused: "#F5F5F5",

        tabBarIconBackgroundUnfocused: defaultDarkBackground,
        tabBarIconUnfocused: "#6E6E6E",
        tabBarLabelUnfocused: "#6E6E6E",

        tabBarGradientStart: "#00000000"
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
    tile: {
        background: "#181818",
        border: "#2E2E2E",
        text: "#F5F5F5",
        textUnfocused: "#6E6E6E",
        textInverted: "#000",
        icons: "#F5F5F5",
        tint: "#007AFF",
        positiveTint: "#34C759",
        negativeTint: "#FF3B30"
    },
    menuItem: {
        background: "#181818",
        separator: "#3C3C3C",
        border: "#2E2E2E",
        text: "#F5F5F5",
        textUnfocused: "#6E6E6E",
        textInverted: "#000",
        textOverTint: "#F5F5F5",
        icons: "#F5F5F5",
        tint: "#007AFF",
    },
    themeName: "dark"
}