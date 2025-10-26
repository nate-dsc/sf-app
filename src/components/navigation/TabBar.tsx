import { useStyle } from "@/context/StyleContext";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AddButton from "../buttons/AddButton";
import { TabBarStyles } from "./TabBarStyles";

type QuickAction = {
    key: string;
    label: string;
    onPress: () => void;
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useStyle();
    const styles = TabBarStyles(theme)
    const router = useRouter()
    const { t } = useTranslation()
    const [showOptions, setShowOptions] = useState(false)

    const addButtonSize = 60
    const quickActions = useMemo<QuickAction[]>(() => [
        {
            key: "purchase",
            label: t("quickActions.newPurchase", { defaultValue: "Nova compra" }),
            onPress: () => router.push("/modalAdd"),
        },
        {
            key: "installmentPurchase",
            label: t("quickActions.newInstallmentPurchase", { defaultValue: "Nova compra parcelada" }),
            onPress: () => router.push("/modalAddInstallment"),
        },
    ], [router, t])

    const handleActionPress = (action: QuickAction) => {
        setShowOptions(false)
        action.onPress()
    }

    return (
        <View style={styles.tabBarContainer}>
            <LinearGradient
                colors={[theme.navigation.tabBarGradientStart, theme.navigationTheme.colors.background]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />
            {showOptions ? (
                <Pressable style={styles.optionsBackdrop} onPress={() => setShowOptions(false)} />
            ) : null}
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
                    if (route.name === "(home)") isFocused ? iconName = "home" : iconName = "home-outline";
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
                                    style={[styles.tabBarHighlight, { backgroundColor: isFocused ? theme.colors.blue : theme.colors.gray5 }]}
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
            <View style={styles.addButtonWrapper} pointerEvents="box-none">
                {showOptions ? (
                    <View style={[styles.optionsWrapper, { bottom: addButtonSize + 16 }]}>
                        <View
                            style={[
                                styles.optionsContainer,
                                {
                                    backgroundColor: theme.background.group.secondaryBg,
                                    borderColor: theme.separator.translucent,
                                },
                            ]}
                        >
                            {quickActions.map((action, index) => (
                                <View key={action.key}>
                                    <Pressable
                                        style={styles.optionButton}
                                        onPress={() => handleActionPress(action)}
                                    >
                                        <Text style={styles.optionText}>
                                            {action.label}
                                        </Text>
                                    </Pressable>
                                    {index < quickActions.length - 1 ? (
                                        <View style={[styles.optionDivider, { backgroundColor: theme.separator.translucent }]} />
                                    ) : null}
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}
                <AddButton size={addButtonSize} onPress={() => setShowOptions((prev) => !prev)} />
            </View>
        </View>
    )
}
