import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { TabBarStyles } from "./TabBarStyles";

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme, preference, setPreference } = useTheme();
    const styles = TabBarStyles(theme)

  return (
    <View
      style={[styles.tabBar, {
        gap: 10,
        padding: 5,
        marginLeft: 20,
        marginRight: 100,
        position: "absolute",
        bottom: 25,
      }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const tablabel =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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

        // Aqui você pode definir ícones diferentes pra cada rota
        let iconName: keyof typeof Ionicons.glyphMap = "help";
        if (route.name === "index") iconName = "home";
        else if (route.name === "settings") iconName = "settings";

        return (
        <View 
            key={route.key} style={{flex: 1}}>
            <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                    flex: 1,
                    backgroundColor: "red",
                    //height: 80,
                    //width: 80,
                    //flex: 1,
                    //padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Fundo circular ativo */}
                <View
                style={{
                    flex: 1,
                    //aspectRatio: 1,
                    padding: 10,
                    backgroundColor: isFocused
                    ? theme.menuItem.tint
                    : theme.menuItem.background,
                    borderRadius: 35,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <Ionicons
                    name={iconName}
                    size={28}
                    color={isFocused ? "#fff" : theme.menuItem.textUnfocused}
                />
                <Text
                    style={{
                    color: isFocused ? "#fff" : theme.menuItem.textUnfocused,
                    fontSize: 12,
                    lineHeight: 22,
                    //marginTop: 3,
                    fontWeight: isFocused ? "600" : "400",
                    }}
                >
                    {tablabel as string}
                </Text>
                </View>
            </Pressable>
            </View>
            );
        })}
        </View>
    
  );
}
