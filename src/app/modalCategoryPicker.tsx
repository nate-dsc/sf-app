import CategoryList, { Category } from "@/components/menu-items/ListPicker";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CategoryPicker() {

    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [selected, setSelected] = useState<string | null>(null);
    
    const data: Category[] = [
        { id: "1", title: "Alimentação", iconName: "fast-food" },
        { id: "2", title: "Transporte", iconName: "car" },
        { id: "3", title: "Saúde", iconName: "fitness" },
        { id: "4", title: "Educação", iconName: "school" },
    ];
    
    return(
            <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, {paddingHorizontal: 20, marginBottom: insets.bottom}]}>
                    <CategoryList
                        categories={data}
                        selectedId={selected}
                        onSelect={(id) => setSelected(id)}
                    />
            </ScrollView>
    )
}
