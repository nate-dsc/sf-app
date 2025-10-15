import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

type Category = {
    id: string;
    iconName: IoniconName;
}

const categoryList: Category[] = [
    { id: "1", iconName: "home" },
    { id: "2", iconName: "restaurant" },
    { id: "3", iconName: "cart" },
    { id: "4", iconName: "car" },
    { id: "5", iconName: "construct" },
    { id: "6", iconName: "ticket" },
    { id: "7", iconName: "school" },
    { id: "8", iconName: "bag-handle" },
    { id: "9", iconName: "trending-up" },
    { id: "10", iconName: "fitness" },
    { id: "11", iconName: "medical" },
    { id: "12", iconName: "airplane" },
    { id: "13", iconName: "paw" },
    { id: "14", iconName: "game-controller" },
    { id: "15", iconName: "dice" },
    { id: "16", iconName: "ellipsis-horizontal" },
    { id: "21", iconName: "cash" },
    { id: "22", iconName: "hammer" },
    { id: "23", iconName: "id-card" },
    { id: "24", iconName: "time" },
    { id: "25", iconName: "today" },
    { id: "26", iconName: "pricetag" },
    { id: "27", iconName: "trending-up" },
    { id: "28", iconName: "dice" },
    { id: "29", iconName: "ellipsis-horizontal" }
];

export function categoryIDtoIconName(id: string|number){
    const category = categoryList.find(item => item.id === String(id))
    return category ? category.iconName : "help-circle-outline"
}