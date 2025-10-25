import { light } from "@/styles/colors"
import { Layout } from "@/styles/layoutPresets"

export type ThemePreference = "system" | "light" | "dark"

export type LayoutType = "normal" | "borderless"

export type CustomTheme = typeof light

export type CustomLayout = typeof Layout
