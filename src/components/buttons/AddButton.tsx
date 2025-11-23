import { useStyle } from "@/context/StyleContext";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AppIcon } from "../AppIcon";

type AddButtonProps = {
    size?: number,
    //onPress?: () => void
}

export default function AddButton({ size=40}: AddButtonProps) {

    const router = useRouter()
    const {theme} = useStyle()
    const iconSize = size - 2
    
    return(
        <TouchableOpacity
            style={{
                width: size,
                height: size,
                borderRadius: size/2,
                zIndex: 1,
                backgroundColor: theme.colors.green,
                borderWidth: 1,
                borderColor: "#3ADD63",
                justifyContent: "center",
                alignItems: "center",

                shadowColor: "#000",
                shadowRadius: 10,
                shadowOffset: {width: 0, height: 10},
                shadowOpacity: 0.15,
            }}
            onPress={() => router.navigate("/modalAdd")}
        >
            <AppIcon name="plus" androidName="add" size={iconSize} tintColor={"#F5F5F5"} />
        </TouchableOpacity>
    )

}