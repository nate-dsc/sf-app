import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // npm i react-native-vector-icons
import React from "react";
import { FlatList, GestureResponderEvent, ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";

type iconName = React.ComponentProps<typeof Ionicons>["name"]

export type SSListItem<T> = {
    id: string,
    label: string;
    value: T;
    iconName?: iconName;
};

type Props<T> = {
    items: SSListItem<T>[],
    selectedId?: string | null,
    onSelect: (id: string, label: string, value: T) => void,
    compact?: boolean
};

export default function SSList<T>({ items, selectedId = null, onSelect, compact = false }: Props<T>) {

    const iconSize = 30
    const checkmarkSize = 30

    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)

    const renderItem = ({ item }: ListRenderItemInfo<SSListItem<T>>) => {
        const selected = item.id === selectedId

        const handlePress = (e: GestureResponderEvent) => {
            onSelect(item.id, item.label, item.value);
        }

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
                    {!compact && <View style={menuStyles.leftContainer}>
                    {item.iconName ?
                    (<Ionicons name={item.iconName} size={iconSize} color={menuStyles.icon.color} />)
                    : (<View style={{ width: iconSize, height: iconSize }} />)
                    }
                    </View>}

                    <View style={{ flexGrow: 1, padding: 12, paddingLeft: 20 }}>
                    <Text
                    style={[menuStyles.text, FontStyles.body]}
                    >{item.label}</Text>
                    </View>

                    <View style={{ alignSelf: "center", position: "absolute", right: 8 }}>
                    {selected ? <Ionicons name="checkmark" size={checkmarkSize} color={menuStyles.listItemCheckmark.color} />
                    : <View style={{ width: checkmarkSize, height: checkmarkSize }} />}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <FlatList
            style={menuStyles.listPickerContainer}
            data={items}
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
            bounces={false}
            ItemSeparatorComponent={() => (<View style={menuStyles.listPickerSeparator} />)}
            scrollEnabled={false}
        />
    )
}
