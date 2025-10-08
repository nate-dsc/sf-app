// CategoryList.tsx
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons"; // npm i react-native-vector-icons
import React from "react";
import { FlatList, GestureResponderEvent, ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";

type iconName = React.ComponentProps<typeof Ionicons>["name"]

export type MSListItem<T> = {
    id: string,
    label: string,
    value: T,
    iconName?: iconName;
}

type Props<T> = {
    items: MSListItem<T>[],
    selectedIds?: string[],
    onSelect: (id: string, value: T) => void,
}

export default function MSList<T>({items, selectedIds = [], onSelect}: Props<T>) {

    const iconSize = 30
    const checkmarkSize = 30

    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)

    const renderItem = ({ item }: ListRenderItemInfo<MSListItem<T>>) => {
        const selected = selectedIds.includes(item.id)

        const handlePress = (e: GestureResponderEvent) => {
            onSelect(item.id, item.value)
        }

        return (
            <View>
                <TouchableOpacity
                    onPress={handlePress}
                    style={{
                        flex: 1,
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
                        >{item.label}</Text>
                    </View>

                    <View style={{ alignSelf: "center", paddingRight: 8}}>
                        {selected ? <Ionicons name="checkmark" size={checkmarkSize} color={menuStyles.listItemCheckmark.color} />
                        : <View style={{width: checkmarkSize, height: checkmarkSize}}/>}
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
            ItemSeparatorComponent={() => (<View style={menuStyles.listPickerSeparator}/>)}
            scrollEnabled={false}
        />
    )
}
