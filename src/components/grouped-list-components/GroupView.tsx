import { useStyle } from "@/context/StyleContext";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

type GroupViewProps = {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function GroupView({ children, style }: GroupViewProps) {
  const { theme, layout } = useStyle();

  return (
    <View
      style={[
        {
          paddingHorizontal: layout.margin.contentArea,
          borderRadius: layout.radius.groupedView,
          backgroundColor: theme.fill.secondary,
        },
        style, // permite sobrescrever estilos
      ]}
    >
      {children}
    </View>
  );
}
