import CreditCardView from "@/components/CreditCardView";
import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import SimpleColorPicker from "@/components/pickers/SimpleColorPicker";
import { useStyle } from "@/context/StyleContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import { ScrollView, View } from "react-native";



export default function AddCardModal() {

    const {theme, layout} = useStyle()

    const colors = theme.colors

    const [selectedColor, setSelectedColor] = useState(colors.gray1)
    const [name, setName] = useState("")

    const colorOptions = [
        { code: colors.red, label: "Vermelho" },
        { code: colors.orange, label: "Laranja" },
        { code: colors.mint, label: "Menta" },
        { code: colors.green, label: "Verde" },
        { code: colors.cyan, label: "Ciano" },
        { code: colors.purple, label: "Roxo" },
        { code: colors.indigo, label: "Anil" },
        { code: colors.gray1, label: "Cinza" },
    ]
    
    return(
        <ScrollView 
            contentContainerStyle={{
                flex: 1,
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                gap: layout.margin.sectionGap
            }}>

            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <CreditCardView color={selectedColor} name={name} />
            </View>

            <View 
                style={{
                    paddingHorizontal: layout.margin.contentArea,
                    borderRadius: layout.radius.groupedView,
                    backgroundColor: theme.fill.secondary
                }}
            >
                <GTextInput
                    separator={"translucent"}
                    label={"Nome"}
                    value={name}
                    onChangeText={setName}
                    acViewKey={"nome"}
                    maxLength={20}
                />
                <GValueInput
                    separator={"translucent"}
                    label={"Limite"}
                    acViewKey={"lim"}
                    onChangeNumValue={() => {}}
                    flowType={"inflow"}
                />
                <GDateInput
                    separator={"translucent"}
                    label={"Data de fechamento"}
                    value={new Date()}
                    onDateChange={() => {}}
                />
                <GDateInput
                    separator="none"
                    label="Data de vencimento"
                    value={new Date()}
                    onDateChange={() => {}}
                />
            </View>
            <SimpleColorPicker
                colors={colorOptions}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
            />

            
        </ScrollView>
    )
}