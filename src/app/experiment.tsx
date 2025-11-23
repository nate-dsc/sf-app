import { AppIcon } from "@/components/AppIcon"
import GroupedGenericComponent from "@/components/grouped-list-components/generic/GroupedGenericComponent"
import { useStyle } from "@/context/StyleContext"
import { useHeaderHeight } from "@react-navigation/elements"
import React from "react"
import { StyleSheet, View } from "react-native"


const DATA = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function BlurredListExample() {
    const {theme} = useStyle()
    const headerHeight = useHeaderHeight()

    return (
        <View
            style={{
                flex: 1,
                paddingTop: headerHeight + 16,
                paddingHorizontal: 16,
            }}
        >
            <View
                style={{
                    borderRadius: 26,
                    backgroundColor: theme.fill.secondary,
                    overflow: "hidden"
                }}
            >
                <GroupedGenericComponent
                    onPress={()=>{}}
                    leadingIcon={
                        <AppIcon
                            name={"house"}
                            androidName={"light"}
                            size={29}
                            tintColor={theme.colors.red}
                        />
                    }
                    leadingLabel="This is a very long text to test what happens when this component receives a large text"
                    trailingLabel="What if I have a big trailing label too?"
                    trailingIcon={
                        <AppIcon
                            name={"chevron.forward"}
                            androidName={"light"}
                            size={18}
                            tintColor={theme.colors.red}
                        />
                    }
                    separator={"translucent"}
                />
                <GroupedGenericComponent
                    onPress={()=>{}}
                    leadingIcon={
                        <AppIcon
                            name={"house"}
                            androidName={"light"}
                            size={29}
                            tintColor={theme.colors.green}
                        />
                    }
                    separator={"translucent"}
                />
                <GroupedGenericComponent
                    onPress={()=>{}}
                    leadingIcon={
                        <AppIcon
                            name={"house"}
                            androidName={"light"}
                            size={29}
                            tintColor={theme.colors.blue}
                        />
                    }
                    separator={"translucent"}
                />
                <GroupedGenericComponent
                    onPress={()=>{}}
                    separator={"none"}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 120,
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  maskedView: {
    height: 250, // Altura fixa da lista
  },
  list: {
    flexGrow: 0,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 16,
  },
});
