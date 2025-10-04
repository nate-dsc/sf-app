import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Frequency, RRule, Weekday } from "rrule";

import { useHeaderHeight } from "@react-navigation/elements";

// Tipos possíveis de frequência
const FREQUENCIES = [
  { label: "Diariamente", value: RRule.DAILY },
  { label: "Semanalmente", value: RRule.WEEKLY },
  { label: "Mensalmente", value: RRule.MONTHLY },
  { label: "Anualmente", value: RRule.YEARLY },
];

// Dias da semana (para uso com WEEKLY)
const WEEK_DAYS = [
  { label: "Dom", value: RRule.SU },
  { label: "Seg", value: RRule.MO },
  { label: "Ter", value: RRule.TU },
  { label: "Qua", value: RRule.WE },
  { label: "Qui", value: RRule.TH },
  { label: "Sex", value: RRule.FR },
  { label: "Sáb", value: RRule.SA },
];

export default function RecurrenceScreen() {
    const paddingTop = useHeaderHeight() + 10

  const [freq, setFreq] = useState<Frequency>(RRule.WEEKLY);
  const [interval, setInterval] = useState<number>(1);
  const [byWeekDays, setByWeekDays] = useState<Weekday[]>([]);
  const [until, setUntil] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Alternar seleção de dia da semana
  const toggleWeekDay = (day: Weekday) => {
    setByWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Gera a RRULE
  const generateRRule = () => {
    const rule = new RRule({
      freq,
      interval,
      byweekday: freq === RRule.WEEKLY ? byWeekDays : undefined,
      until: until || undefined,
    });
    return rule.toString();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, {paddingTop: paddingTop}]}>
      <Text style={styles.title}>Definir Recorrência</Text>

      {/* Frequência */}
      <Text style={styles.label}>Frequência:</Text>
      <View style={styles.row}>
        {FREQUENCIES.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.option, freq === f.value && styles.optionSelected]}
            onPress={() => setFreq(f.value)}
          >
            <Text style={styles.optionText}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Intervalo */}
      <Text style={styles.label}>A cada:</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.option, interval === n && styles.optionSelected]}
            onPress={() => setInterval(n)}
          >
            <Text style={styles.optionText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.labelSmall}>
          {freq === RRule.DAILY
            ? "dias"
            : freq === RRule.WEEKLY
            ? "semanas"
            : freq === RRule.MONTHLY
            ? "meses"
            : "anos"}
        </Text>
      </View>

      {/* Dias da semana (se semanal) */}
      {freq === RRule.WEEKLY && (
        <>
          <Text style={styles.label}>Dias da semana:</Text>
          <View style={styles.row}>
            {WEEK_DAYS.map((d) => (
              <TouchableOpacity
                key={d.label}
                style={[
                  styles.optionSmall,
                  byWeekDays.includes(d.value) && styles.optionSelected,
                ]}
                onPress={() => toggleWeekDay(d.value)}
              >
                <Text style={styles.optionText}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Data final */}
      <Text style={styles.label}>Data final:</Text>
      <Button
        title={until ? until.toLocaleDateString() : "Selecionar data"}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={until || new Date()}
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setUntil(date);
          }}
        />
      )}

      {/* Resultado */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>RRULE gerada:</Text>
        <Text selectable style={styles.resultText}>
          {generateRRule()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 14,
    marginLeft: 10,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  option: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionSmall: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  optionSelected: {
    backgroundColor: "#2196F3",
  },
  optionText: {
    color: "#000",
  },
  resultBox: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
  },
  resultLabel: {
    fontWeight: "600",
    marginBottom: 6,
  },
  resultText: {
    fontFamily: "monospace",
    color: "#333",
  },
});
