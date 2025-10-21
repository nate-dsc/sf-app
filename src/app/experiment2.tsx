import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ExampleScreen() {
  return (
    <View style={styles.container}>
      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>Item {i + 1}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Botões fixos */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.secondary]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primary]}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // espaço extra para não ficar atrás dos botões
  },
  item: {
    backgroundColor: "#e5e5e5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
})