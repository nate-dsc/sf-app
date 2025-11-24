import { useStyle } from "@/context/StyleContext"
import { Ionicons } from "@expo/vector-icons"
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React, { ReactElement, cloneElement, isValidElement, useMemo, useState } from "react"
import { Pressable, Text, View } from "react-native"

type NavigationAction = {
    key: string
    label: string
    description?: string
}

type NewTabBarProps = BottomTabBarProps & {
    actions?: NavigationAction[]
    onActionPress?: (key: string) => void
}

const DEFAULT_ACTIONS: NavigationAction[] = [
    { key: "transaction", label: "New transaction", description: "Create a one-time entry" },
    { key: "card", label: "New card", description: "Add a card to track purchases" },
    { key: "installment", label: "Installment purchase", description: "Schedule a split payment" },
]

const TAB_HORIZONTAL_PADDING = 12
const TAB_VERTICAL_PADDING = 10
const BORDER_RADIUS = 20

export default function NewTabBar({
    state,
    descriptors,
    navigation,
    insets,
    actions = DEFAULT_ACTIONS,
    onActionPress,
}: NewTabBarProps) {
    const { theme } = useStyle()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const bottomOffset = useMemo(() => (insets?.bottom ?? 0) + 24, [insets?.bottom])

    const handleActionPress = (key: string) => () => {
        setIsMenuOpen(false)
        onActionPress?.(key)
    }

    return (
        <View
            pointerEvents="box-none"
            style={{ position: "absolute", left: 16, right: 16, bottom: bottomOffset, alignItems: "center" }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: TAB_VERTICAL_PADDING,
                        paddingHorizontal: TAB_HORIZONTAL_PADDING,
                        borderRadius: BORDER_RADIUS,
                        borderCurve: "continuous",
                        backgroundColor: theme.navigation.tabBarBackground,
                        borderWidth: 1,
                        borderColor: theme.navigation.tabBarBorder,
                        shadowColor: "#1f1f1f",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 2,
                    }}
                >
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key]

                        if (["_sitemap", "+not-found"].includes(route.name)) return null

                        const focused = state.index === index
                        const iconColor = focused
                            ? options.tabBarActiveTintColor ?? theme.menuItem.textOverTint
                            : options.tabBarInactiveTintColor ?? theme.menuItem.textUnfocused
                        const tabLabel =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                ? options.title
                                : route.name

                        const resolvedIcon = () => {
                            if (options.tabBarIcon) {
                                const icon = options.tabBarIcon({ focused, color: iconColor, size: 24 })
                                if (isValidElement(icon)) {
                                    return cloneElement(icon as ReactElement, { color: iconColor })
                                }
                                return icon
                            }

                            let iconName: keyof typeof Ionicons.glyphMap = "ellipse"
                            if (route.name === "(home)") iconName = focused ? "home" : "home-outline"
                            else if (route.name === "history") iconName = focused ? "list" : "list-outline"
                            else if (route.name === "planning") iconName = focused ? "calendar" : "calendar-outline"

                            return <Ionicons name={iconName} size={22} color={iconColor} />
                        }

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            })

                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params)
                            }
                        }

                        const onLongPress = () => {
                            navigation.emit({
                                type: "tabLongPress",
                                target: route.key,
                            })
                        }

                        return (
                            <Pressable
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={focused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    paddingVertical: TAB_VERTICAL_PADDING,
                                    paddingHorizontal: TAB_HORIZONTAL_PADDING,
                                    borderRadius: 14,
                                    borderCurve: "continuous",
                                    backgroundColor: focused ? theme.colors.blue : undefined,
                                }}
                            >
                                {resolvedIcon()}
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: iconColor,
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {tabLabel as string}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>

                <View style={{ position: "relative", justifyContent: "flex-end" }}>
                    <Pressable
                        style={({ pressed }) => ({
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            borderCurve: "continuous",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.navigation.tabBarBackground,
                            borderWidth: 1,
                            borderColor: theme.navigation.tabBarBorder,
                            shadowColor: "#1f1f1f",
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.15,
                            shadowRadius: 16,
                            elevation: 3,
                            opacity: pressed ? 0.85 : 1,
                        })}
                        onPress={() => setIsMenuOpen((prev) => !prev)}
                        accessibilityRole="button"
                        accessibilityLabel="Open creation menu"
                    >
                        <Ionicons name="add" size={28} color={theme.navigation.tabBarForeground} />
                    </Pressable>

                    {isMenuOpen && (
                        <View
                            style={{
                                position: "absolute",
                                bottom: 68,
                                right: 0,
                                minWidth: 220,
                                padding: 10,
                                borderRadius: 16,
                                borderCurve: "continuous",
                                backgroundColor: theme.navigation.tabBarBackground,
                                borderWidth: 1,
                                borderColor: theme.navigation.tabBarBorder,
                                shadowColor: "#1f1f1f",
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.15,
                                shadowRadius: 18,
                                elevation: 4,
                                gap: 6,
                            }}
                        >
                            {actions.map((action) => (
                                <Pressable
                                    key={action.key}
                                    onPress={handleActionPress(action.key)}
                                    style={({ pressed }) => ({
                                        paddingVertical: 10,
                                        paddingHorizontal: 12,
                                        borderRadius: 12,
                                        borderCurve: "continuous",
                                        backgroundColor: pressed
                                            ? theme.colors.gray6
                                            : theme.navigationTheme.colors.background,
                                    })}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "700",
                                            color: theme.menuItem.textBase,
                                        }}
                                    >
                                        {action.label}
                                    </Text>
                                    {action.description ? (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: theme.menuItem.textUnfocused,
                                                marginTop: 2,
                                            }}
                                        >
                                            {action.description}
                                        </Text>
                                    ) : null}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}
