import CategoryList, { type Category } from "@/components/menu-items/ListPicker";
import { SStyles } from "@/components/styles/ScreenStyles";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function Experiment() {
    const [selected, setSelected] = useState<string | null>(null);

    const data: Category[] = [
        { id: "1", title: "Alimentação", iconName: "fast-food" },
        { id: "2", title: "Transporte", iconName: "car" },
        { id: "3", title: "Saúde", iconName: "fitness" },
        { id: "4", title: "Educação", iconName: "school" },
    ];

    const paddingTop = useHeaderHeight() + 10

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>

        <CategoryList
            categories={data}
            selectedId={selected}
            onSelect={(id) => setSelected(id)}
         />

        </ScrollView>
    )
}