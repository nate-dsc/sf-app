import { DarkTheme, DefaultTheme } from "@react-navigation/native"

const red = "rgb(255,56,60)"
const redDark = "rgb(255,66,69)"

const orange = "rgb(255,141,40)"
const orangeDark = "rgb(255,146,48)"

const yellow = "rgb(255,204,0)"
const yellowDark = "rgb(255,214,0)"

const green = "rgb(52,199,89)"
const greenDark = "rgb(48,209,88)"

const mint = "rgb(0,200,179)"
const mintDark = "rgb(0,218,195)"

const teal = "rgb(0,195,208)"
const tealDark = "rgb(0,210,224)"

const cyan = "rgb(0,192,232)"
const cyanDark = "rgb(60,211,254)"

const blue = "rgb(0,136,255)"
const blueDark = "rgb(0,145,255)"

const indigo = "rgb(255,141,40)"
const indigoDark = "rgb(255,146,48)"

const purple = "rgb(203,48,224)"
const purpleDark = "rgb(219,52,242)"

const pink = "rgb(255,45,85)"
const pinkDark = "rgb(255,55,95)"

const brown = "rgb(172,127,94)"
const brownDark = "rgb(183,138,102)"

const gray1 = "rgb(142,142,147)"
const gray1Dark = "rgb(142,142,147)"

const gray2 = "rgb(174,174,178)"
const gray2Dark = "rgb(99,99,102)"

const gray3 = "rgb(199,199,204)"
const gray3Dark = "rgb(72,72,74)"

const gray4 = "rgb(209,209,214)"
const gray4Dark = "rgb(58,58,60)"

const gray5 = "rgb(229,229,234)"
const gray5Dark = "rgb(44,44,46)"

const gray6 = "rgb(242,242,247)"
const gray6Dark = "rgb(28,28,30)"

const background = "#FFFFFFFF"
const secondaryBackground = "#F2F2F7FF"
const tertiaryBackground = "#FFFFFFFF"
const groupBackground = "#F2F2F7FF"
const groupSecondaryBackground = "#FFFFFFFF"
const groupTertiaryBackground = "#F2F2F7FF"

const backgroundDark = "#000000FF"
const secondaryBackgroundDark = "#1C1C1EFF"
const tertiaryBackgroundDark = "#2C2C2EFF"
const groupBackgroundDark = "#000000FF"
const groupSecondaryBackgroundDark = "#1C1C1EFF"
const groupTertiaryBackgroundDark = "#2C2C2EFF"

const label = "#000000FF"
const secondaryLabel = "#3C3C4399"
const tertiaryLabel = "#3C3C434D"
const quaternaryLabel = "#3C3C432E"
const labelDark = "#FFFFFFFF"
const secondaryLabelDark = "#EBEBF599"
const tertiaryLabelDark = "#EBEBF54D"
const quaternaryLabelDark = "#EBEBF52E"

const placeholderText = "#3C3C434D"
const placeholderTextDark = "#EBEBF54D"

const separator = "#3C3C434A"
const separatorDark = "#54545899"

const opaqueSeparator = "#C6C6C8FF"
const opaqueSeparatorDark = "#38383AFF"

const tertiaryFill = "rgba(118,118,128,0.12)"
const tertiaryFillDark = "rgba(118,118,128,0.24)"

const scSelected = "#FFFFFF"
const scSelectedDark = "#6C6C71"

const defaultTint = "#007AFF"

const defaultLightBackground = "#F8F8F8"
const defaultLightBorder = "#FFFFFF"

const defaultDarkBackground = "#181818"
const defaultDarkBorder = "#2E2E2E"

type CustomTheme = {
    themeName: string,
    navigationTheme: typeof DefaultTheme,

    colors: {
        white: string,
        black: string,
        red: string,
        orange: string,
        yellow: string,
        green: string,
        mint: string,
        teal: string,
        cyan: string,
        blue: string,
        indigo: string,
        purple: string,
        pink: string,
        brown: string,
        gray1: string,
        gray2: string,
        gray3: string,
        gray4: string,
        gray5: string,
        gray6: string,
    },
    background: {
        bg: string,
        secondaryBg: string,
        tertiaryBg: string,
        groupBg: string,
        groupSecondaryBg: string,
        groupTertiaryBg: string,
    },
    text: {
        label: string,
        secondaryLabel: string,
        tertiaryLabel: string,
        quaternaryLabel: string,
        placeholder: string,
    },
    separator: {
        translucent: string,
        opaque: string,
    },
    fill: {
        tertiary: string,
    },
    
    segmentedControl: {
        selected: string,
    }

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
    
}

export const light: CustomTheme = {
    themeName: "light",
    navigationTheme: {
        ...DefaultTheme,
        dark: false,
        colors: {
        primary: blue,
        //background: "#F2F2F2",
        //background: "#ebebebff",
        background: groupBackground,
        //card: "#FFFFFF",
        card: groupSecondaryBackground,
        text: "#000",
        border: "#000",
        notification: red,
        },
    },

    colors: {
        white: "#FFFFFF",
        black: "#000000",
        red: red,
        orange: orange,
        yellow: yellow,
        green: green,
        mint: mint,
        teal: teal,
        cyan: cyan,
        blue: blue,
        indigo: indigo,
        purple: purple,
        pink: pink,
        brown: brown,
        gray1: gray1,
        gray2: gray2,
        gray3: gray3,
        gray4: gray4,
        gray5: gray5,
        gray6: gray6,
    },
    background: {
        bg: background,
        secondaryBg: secondaryBackground,
        tertiaryBg: tertiaryBackground,
        groupBg: groupBackground,
        groupSecondaryBg: groupSecondaryBackground,
        groupTertiaryBg: groupTertiaryBackground,
    },
    text: {
        label: label,
        secondaryLabel: secondaryLabel,
        tertiaryLabel: tertiaryLabel,
        quaternaryLabel: quaternaryLabel,
        placeholder: placeholderText,
    },
    separator: {
        translucent: separator,
        opaque: opaqueSeparator,
    },
    fill: {
        tertiary: tertiaryFill,
    },

    segmentedControl: {
        selected: scSelected
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
}

export const dark: CustomTheme = {
    navigationTheme: {
        ...DarkTheme,
        dark: true,
        colors: {
        primary: blueDark,
        //background: "#000",
        background: groupBackgroundDark,
        //card: "#202020",
        card: groupSecondaryBackgroundDark,
        text: "#FFFFFF",
        //border: "#808080",
        border: "#FFF",
        notification: redDark,
        },
    },

    colors: {
        white: "#FFFFFF",
        black: "#000000",
        red: redDark,
        orange: orangeDark,
        yellow: yellowDark,
        green: greenDark,
        mint: mintDark,
        teal: tealDark,
        cyan: cyanDark,
        blue: blueDark,
        indigo: indigoDark,
        purple: purpleDark,
        pink: pinkDark,
        brown: brownDark,
        gray1: gray1Dark,
        gray2: gray2Dark,
        gray3: gray3Dark,
        gray4: gray4Dark,
        gray5: gray5Dark,
        gray6: gray6Dark,
    },
    background: {
        bg: backgroundDark,
        secondaryBg: secondaryBackgroundDark,
        tertiaryBg: tertiaryBackgroundDark,
        groupBg: groupBackgroundDark,
        groupSecondaryBg: groupSecondaryBackgroundDark,
        groupTertiaryBg: groupTertiaryBackgroundDark,
    },
    text: {
        label: labelDark,
        secondaryLabel: secondaryLabelDark,
        tertiaryLabel: tertiaryLabelDark,
        quaternaryLabel: quaternaryLabelDark,
        placeholder: placeholderTextDark,
    },
    separator: {
        translucent: separatorDark,
        opaque: opaqueSeparatorDark,
    },
    fill: {
        tertiary: tertiaryFillDark,
    },
    
    segmentedControl: {
        selected: scSelectedDark
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