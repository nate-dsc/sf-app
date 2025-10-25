import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import { useStyle } from "@/context/StyleContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { ScrollView, View } from "react-native";



export default function AddCardModal() {

    const {theme, layout} = useStyle()
    
    return(
        <ScrollView 
            contentContainerStyle={{
                flex: 1,
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
            }}>

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

            
        </ScrollView>
    )
}