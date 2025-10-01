import CSwitch from "@/components/menu-items/CSwitch"
import DatePicker from "@/components/menu-items/DatePicker"
import DescriptionInput from "@/components/menu-items/DescriptionInput"
import Redir from "@/components/menu-items/Redir"
import SRedir from "@/components/menu-items/RedirSelect"
import ValueInput from "@/components/menu-items/ValueInput"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { ScrollView } from "react-native"

export default function SettingsScreen() {

    const [category, setCategory] = useState("")
    
    const headerHeight = useHeaderHeight()

    return(
        <ScrollView contentContainerStyle={[{paddingTop: headerHeight, marginTop: 4}, SStyles.mainContainer]}>
            <Redir iconName="cog-outline" text="Test setting" onPress={() => {}} />

            <Redir text="No icon!" onPress={() => {setCategory("casa")}} />

            <SRedir text="Selecionar!!" selected={category} onPress={() => {}}/>

            <DatePicker text="Data!!"/>

            <CSwitch text="uma switch" />

            <ValueInput leftText="TESTE" />

            <DescriptionInput leftText="teste"/>

        </ScrollView>
    )
}