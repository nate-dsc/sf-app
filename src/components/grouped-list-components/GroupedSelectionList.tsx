import GroupView from "@/components/grouped-list-components/GroupView"
import GRedir from "@/components/grouped-list-components/GroupedRedirect"
import { GSListItem } from "@/types/components"
import React from "react"
import { View } from "react-native"

type Props<T> = {
    items: GSListItem<T>[]
    selectedIds?: string[] | undefined
    singleSelect?: boolean
    onSelect: (id: string, label: string, value: T) => void
    showIcons?: boolean
}

export default function GSelectionList<T>({items, selectedIds = [], singleSelect = false, onSelect, showIcons = true}: Props<T>) {

    return (
        <GroupView>
            {items.map((item, index) => {
                const selected = selectedIds ? selectedIds.includes(item.id) : false
                const isLast = index === items.length - 1

                return (
                    <View key={item.id}>
                        <GRedir
                            separator={isLast ? "none" : "translucent"}
                            icon={showIcons ? item.iconName : undefined}
                            label={item.label}
                            onPress={() => {
                                if (singleSelect) {
                                    onSelect(item.id, item.label, item.value)  // substitui o único valor
                                } else {
                                    onSelect(item.id, item.label, item.value)  // adiciona/remove da lista
                                }
                            }}
                            overrideChevron={selected ? "checkmark" : "none"}
                        />
                    </View>
                )
            })}
        </GroupView>
    )
}
