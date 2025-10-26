import React from "react"
import { StyleSheet, Text, View } from "react-native"

type CreditCardViewProps = {
  color: string
  name: string
}

export default function CreditCardView({ color = "#007AFF", name = "Banco"}: CreditCardViewProps) {
  return (
    <View
    style={{
        width: 200,
        height: 125,
        //aspectRatio: 1.59,
        borderRadius: 16,
        padding: 20,
        elevation: 4, // sombra Android
        shadowColor: "#000", // sombra iOS
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        overflow: "hidden", backgroundColor: color 
        }}
    >
        {/* Faixa magnética */}
        <View 
            style={{
                position: "absolute",
                top: 20,
                left: 0,
                right: 0,
                height: 25,
                backgroundColor: "rgba(0,0,0,0.4)"
            }}
        />

        {/* Chip */}
        <View
            style={{
                width: 40,
                height: 30,
                borderRadius: 6,
                backgroundColor: "#f0c63be0", // dourado
                marginTop: 40,
                marginLeft: 0
            }}
        />

        {/* Nome */}
        <View
            style={{
                position: "absolute",
                top: 65,
                left: 75,
                right: 0
            }}
        >
            <Text
                style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    letterSpacing: 1,
                }}
            >
                {name}
            </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    elevation: 4, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  magneticStripe: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  chip: {
    width: 50,
    height: 38,
    borderRadius: 6,
    backgroundColor: "#d4af37", // dourado
    marginTop: 70,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chipInner: {
    width: "60%",
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
  },
  nameContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  nameText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
})
