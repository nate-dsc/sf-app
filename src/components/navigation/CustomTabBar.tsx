import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AppIcon } from "../AppIcon"
import AddButton from "./TabBarAddButton"

export const TAB_BAR_CONTENT_HEIGHT = 60
export const TAB_BAR_BORDER_WIDTH = 1

export const TAB_BAR_HEIGHT = TAB_BAR_CONTENT_HEIGHT + (2 * TAB_BAR_BORDER_WIDTH)

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useStyle()
    const insets = useSafeAreaInsets()

    const scale = useSharedValue(1)
    
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                paddingBottom: insets.bottom, 
                width: "100%",
                //backgroundColor: theme.colors.red,
                alignItems: "center",
                justifyContent: "flex-end",
            }}
        >
            <LinearGradient
                colors={[theme.navigation.tabBarGradientStart, theme.navigationTheme.colors.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />
            <View
                style={{
                    height: TAB_BAR_HEIGHT,
                    width: "100%",
                    //backgroundColor: theme.colors.blue,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 16
                }}
            >
                <View
                    style={{
                        //maxWidth: "60%",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        //paddingHorizontal: 10,
                        gap: 1,
                        backgroundColor: theme.navigation.tabBarBackground,
                        borderWidth: TAB_BAR_BORDER_WIDTH,
                        borderColor: theme.navigation.tabBarBorder,
                        borderRadius: 10,
                        borderCurve: "continuous",
                        shadowColor: "#3f3f3fff",
                        shadowRadius: 10,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.15,
                    }}
                >   
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key]
                        
                        if (["_sitemap", "+not-found"].includes(route.name)) return null
                        
                        const isFocused = state.index === index
                        const iconColor = isFocused
                            ? options.tabBarActiveTintColor ?? theme.colors.white
                            : options.tabBarInactiveTintColor ?? theme.text.secondaryLabel
                        const tabLabel =
                        (options.tabBarLabel !== undefined) && (typeof options.tabBarLabel === "string")
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name
                        
                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            })
                            
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params)
                            }
                        }

                        const resolvedIcon = () => {
                            if (options.tabBarIcon) {
                                const icon = options.tabBarIcon({ focused: isFocused, color: iconColor, size: 30 })
                                return icon
                            }

                            return(
                                <AppIcon
                                    name={"questionmark"}
                                    androidName={"help-outline"}
                                    size={30}
                                    tintColor={theme.colors.red}
                                />
                            )
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
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{
                                    height: 52,
                                    width: 62,
                                    margin: 4,
                                    paddingHorizontal: 6,
                                    borderRadius: 6,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 2,
                                    backgroundColor: isFocused ? theme.colors.blue : undefined,
                                }}
                            >
                                {resolvedIcon()}
                                <Text
                                    style={{
                                        fontSize: FONT_SIZE.CAPTION2,
                                        fontWeight: isFocused ? FONT_WEIGHT.SEMIBOLD : FONT_WEIGHT.MEDIUM,
                                        color: isFocused ? theme.colors.white : theme.text.secondaryLabel
                                    }}
                                >
                                    {tabLabel}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
                <AddButton
                    borderWidth={TAB_BAR_BORDER_WIDTH}
                    height={TAB_BAR_CONTENT_HEIGHT}
                />
            </View>

        </View>
    )
}
