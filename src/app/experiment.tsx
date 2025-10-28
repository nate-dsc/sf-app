import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const DATA = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function BlurredListExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista</Text>

      <MaskedView
        style={styles.maskedView}
        maskElement={
          <LinearGradient
            // A máscara define onde o conteúdo será visível (opaco = visível)
            colors={["transparent", "black", "black", "transparent"]}
            locations={[0, 0.1, 0.9, 1]}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <FlatList
          data={DATA}
          keyExtractor={(item) => item}
          style={styles.list}
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
      </MaskedView>
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
