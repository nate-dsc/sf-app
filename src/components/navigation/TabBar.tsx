import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme, preference, setPreference } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 80,
        backgroundColor: theme.menuItem.background,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.menuItem.border,
        marginLeft: 20,
        marginRight: 20,
        position: "absolute",
        bottom: 20,
        padding: 10,
        gap: 20
      }}
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
        let iconName: keyof typeof Ionicons.glyphMap = "ellipse";
        if (route.name === "index") iconName = "home";
        else if (route.name === "settings") iconName = "settings";

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{

                backgroundColor: "red",
                width: "30%",
                aspectRatio : 1, 
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Fundo circular ativo */}
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: isFocused
                  ? theme.menuItem.tint
                  : "transparent",
                paddingHorizontal: 0,
                paddingVertical: 0,
                borderRadius: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? "#fff" : theme.menuItem.textUnfocused}
              />
              <Text
                style={{
                  color: isFocused ? "#fff" : theme.menuItem.textUnfocused,
                  fontSize: 12,
                  //marginTop: 3,
                  fontWeight: isFocused ? "600" : "400",
                }}
              >
                {tablabel as string}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
