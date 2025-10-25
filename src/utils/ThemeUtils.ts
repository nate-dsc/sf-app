import { type ThemePreference } from "@/types/theme"

export const preferenceToIndex = (pref: ThemePreference): number => {
    switch(pref) {
        case "system": return 0
        case "light": return 1
        case "dark": return 2
        default: return 0
    }
}

export const indexToPreference = (index: number): ThemePreference => {
    switch(index) {
        case 0: return "system"
        case 1: return "light"
        case 2: return "dark"
        default: return "system"
    }
}

export const strToPreference = (str: string): ThemePreference => {
    switch(str) {
        case "system": return "system"
        case "light": return "light"
        case "dark": return "dark"
        default: return "system"
    }
}