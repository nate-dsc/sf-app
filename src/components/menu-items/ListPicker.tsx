// CategoryList.tsx
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // npm i react-native-vector-icons
import React from "react";
import {
  FlatList,
  GestureResponderEvent,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";
// Se preferir outro pacote de ícones, adapte a importação.

type iconName = React.ComponentProps<typeof Ionicons>["name"]

export type Category = {
  id: string;
  title: string;
  iconName?: iconName; // nome do MaterialIcons (ex: "local-cafe", "fitness-center")
};

type Props = {
  categories: Category[],
  selectedId?: string | null,
  onSelect: (id: string) => void,
};

export default function CategoryList({categories, selectedId = null, onSelect}: Props) {

  const iconSize = 35
  const checkmarkSize = 30

  const theme = useTheme()
  const menuStyles = MIStyles(theme.theme)

  const renderItem = ({ item }: ListRenderItemInfo<Category>) => {
    const selected = item.id === selectedId;

    const handlePress = (e: GestureResponderEvent) => {
      onSelect(item.id);
    };

    return (
      <View>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly"
          }}
        >
          {/* Ícone da esquerda */}
          <View style={menuStyles.leftContainer}>
              { item.iconName ?
                  (<Ionicons name={item.iconName} size={iconSize} color={menuStyles.icon.color}/>)
                  : (<View style={{width: iconSize, height: iconSize}}/>)
              }
          </View>

  
          <View style={{flexGrow: 1, padding: 12, paddingLeft: 20}}>
              <Text
                  style={[menuStyles.text, FontStyles.body]}
              >{item.title}</Text>
          </View>
          <View style={{ alignSelf: "center", paddingRight: 8}}>
            {selected ? <Ionicons name="checkmark" size={checkmarkSize} color={menuStyles.listItemCheckmark.color} />
             : <View style={{width: checkmarkSize, height: checkmarkSize}}/>}
          </View>
        </TouchableOpacity> 
      </View>
    );
  };

  return (
    <FlatList
      style={menuStyles.listPickerContainer}
      data={categories}
      keyExtractor={(c) => c.id}
      renderItem={renderItem}
      bounces={false}
      ItemSeparatorComponent={() => (<View style={{ height: StyleSheet.hairlineWidth, marginHorizontal: 20, backgroundColor: menuStyles.textUnfocused.color }} />)}
      scrollEnabled={false}
    />
  );
}
