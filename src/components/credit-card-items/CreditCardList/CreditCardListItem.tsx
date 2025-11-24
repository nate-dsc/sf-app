import { AppIcon } from "@/components/AppIcon"
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import { CCard } from "@/types/CreditCards"
import { getColorFromID } from "@/utils/CardUtils"
import { Text, TouchableOpacity, View } from "react-native"

type CCListItemProps = {
    item: CCard,
    onItemPress: (item: CCard) => void,
}

export default function CCListItem({item, onItemPress}: CCListItemProps) {

    const {theme, layout} = useStyle()
    const {color, name} = item

    const bgColor = getColorFromID(item.color, theme)

    return(
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: bgColor,
                    borderRadius: layout.radius.sm,
                    borderCurve: "continuous",
                    padding: layout.spacingBl.md
                }}
                onPress={() => onItemPress(item)}
            >
            
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <AppIcon
                        name={"creditcard.fill"}
                        androidName={"credit-card"}
                        size={24}
                        tintColor={theme.colors.white}
                    />
                    <Text
                        style={{
                            fontSize: FONT_SIZE.TITLE3,
                            fontWeight: FONT_WEIGHT.SEMIBOLD,
                            letterSpacing: 1,
                            color: theme.colors.white
                        }}
                    >
                        {name}
                    </Text>
                </View>

                <View>
                    <AppIcon
                        name={"chevron.forward"}
                        androidName={"chevron-right"}
                        size={18}
                        tintColor={theme.colors.white}
                    />
                </View>

            </TouchableOpacity>
        </View>
    )
}
