import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AddButton from "../buttons/AddButton";
import { TabBarStyles } from "./TabBarStyles";

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme, preference, setPreference } = useTheme();
    const styles = TabBarStyles(theme)

    return (
        <View style={styles.tabBarContainer}>
            <LinearGradient
                colors={[theme.navigation.tabBarGradientStart, theme.navigationTheme.colors.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />
            <View
                style={styles.tabBar}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]

                    const tablabel = options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name

                    if (["_sitemap", "+not-found"].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    // Hardcode dos icones
                    let iconName: keyof typeof Ionicons.glyphMap = "help";
                    if (route.name === "index") isFocused ? iconName = "home" : iconName = "home-outline";
                    else if (route.name === "history") isFocused ? iconName = "list" : iconName = "list-outline";
                    else if (route.name === "planning") isFocused ? iconName = "calendar" : iconName = "calendar-outline";

                    return (
                        <View key={route.key}>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                            >
                                {/* Fundo circular ativo */}
                                <View
                                style={[styles.tabBarHighlight, {backgroundColor: isFocused ? theme.colors.blue : theme.colors.gray5 }]}
                                >
                                    <Ionicons
                                        name={iconName}
                                        size={28}
                                        color={isFocused ? theme.menuItem.textOverTint : theme.menuItem.textUnfocused}
                                    />
                                    <Text
                                        style={{
                                            color: isFocused ? theme.menuItem.textOverTint : theme.menuItem.textUnfocused,
                                            paddingTop: 4,
                                            fontSize: 12,
                                            lineHeight: 16,
                                            fontWeight: isFocused ? "600" : "400",
                                        }}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {tablabel as string}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    );
                })} 
            </View>
            <AddButton size={60} />
        </View>  
    )
}
