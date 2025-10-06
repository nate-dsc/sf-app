import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Frequency, Options, RRule, Weekday } from 'rrule';

// Tipos para clareza
type EndCondition = 'never' | 'on_date' | 'after_occurrences';
type MonthlyType = 'day_of_month' | 'day_of_week';

// Constantes para as opções da UI
const FREQUENCIES = [
  { label: 'Diariamente', value: RRule.DAILY },
  { label: 'Semanalmente', value: RRule.WEEKLY },
  { label: 'Mensalmente', value: RRule.MONTHLY },
  { label: 'Anualmente', value: RRule.YEARLY },
];

const WEEKDAYS = [
  { label: 'D', value: RRule.SU },
  { label: 'S', value: RRule.MO },
  { label: 'T', value: RRule.TU },
  { label: 'Q', value: RRule.WE },
  { label: 'Q', value: RRule.TH },
  { label: 'S', value: RRule.FR },
  { label: 'S', value: RRule.SA },
];

const MONTHLY_ORDINAL = [
  { label: 'Primeira', value: 1 },
  { label: 'Segunda', value: 2 },
  { label: 'Terceira', value: 3 },
  { label: 'Quarta', value: 4 },
  { label: 'Última', value: -1 },
];

const RRuleGenerator: React.FC = () => {
    const paddingTop = useHeaderHeight() + 10
  // --- Estados da UI ---
  const [freq, setFreq] = useState<Frequency>(RRule.DAILY);
  const [interval, setInterval] = useState(1);
  const [endCondition, setEndCondition] = useState<EndCondition>('never');
  const [count, setCount] = useState(5);
  const [until, setUntil] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Estado para recorrência semanal
  const [byweekday, setByweekday] = useState<Weekday[]>([new Weekday(new Date().getDay())]);

  // Estados para recorrência mensal
  const [monthlyType, setMonthlyType] = useState<MonthlyType>('day_of_month');
  const [bymonthday, setBymonthday] = useState(new Date().getDate());
  const [monthlyOrdinal, setMonthlyOrdinal] = useState(1);
  const [monthlyWeekday, setMonthlyWeekday] = useState(RRule.MO);

  // --- Estado Final ---
  const [rruleString, setRruleString] = useState('');

  // Hook para gerar a string RRULE sempre que uma opção mudar
  useEffect(() => {
    const options: Partial<Options> = {
      freq,
      interval,
      dtstart: new Date(), // Importante para o contexto da regra
    };

    // Lógica de Término
    if (endCondition === 'on_date') {
      options.until = until;
    } else if (endCondition === 'after_occurrences') {
      options.count = count;
    }

    // Lógica Específica da Frequência
    if (freq === RRule.WEEKLY) {
      if (byweekday.length > 0) {
        options.byweekday = byweekday;
      }
    } else if (freq === RRule.MONTHLY) {
      if (monthlyType === 'day_of_month') {
        options.bymonthday = bymonthday;
      } else {
        options.byweekday = [monthlyWeekday.nth(monthlyOrdinal)];
      }
    }

    try {
        const rule = new RRule(options);
        setRruleString(rule.toString());
    } catch (e) {
        console.error("Erro ao gerar RRULE:", e);
        setRruleString("Regra inválida");
    }

  }, [
    freq,
    interval,
    endCondition,
    count,
    until,
    byweekday,
    monthlyType,
    bymonthday,
    monthlyOrdinal,
    monthlyWeekday
  ]);
  
  // --- Handlers de Interação ---
  const handleWeekdayToggle = (day: Weekday) => {
    setByweekday(prev => {
      const isSelected = prev.some(d => d.weekday === day.weekday);
      if (isSelected) {
        // Não permite desmarcar o último dia
        if (prev.length === 1) return prev;
        return prev.filter(d => d.weekday !== day.weekday);
      } else {
        return [...prev, day].sort((a,b) => a.weekday - b.weekday);
      }
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || until;
    setShowDatePicker(Platform.OS === 'ios');
    setUntil(currentDate);
  };

  const getFrequencyLabel = (f: Frequency, i: number) => {
        // Usamos 'Record' para dizer ao TypeScript que este objeto
        // usará chaves do tipo 'Frequency' e valores do tipo 'string'.
        const labels: Partial<Record<Frequency, string>> = {
            [Frequency.DAILY]: i > 1 ? 'dias' : 'dia',
            [Frequency.WEEKLY]: i > 1 ? 'semanas' : 'semana',
            [Frequency.MONTHLY]: i > 1 ? 'meses' : 'mês',
            [Frequency.YEARLY]: i > 1 ? 'anos' : 'ano',
        };
        
        // Usamos '|| ''` como um fallback para o caso de uma frequência inesperada.
        return labels[f] || '';
  }

  // --- Componentes de Renderização ---

  const renderIntervalSelector = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Repetir a cada</Text>
      <View style={styles.intervalContainer}>
        <TouchableOpacity onPress={() => setInterval(v => Math.max(1, v - 1))} style={styles.stepperButton}>
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.intervalValue}>{interval}</Text>
        <TouchableOpacity onPress={() => setInterval(v => v + 1)} style={styles.stepperButton}>
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.intervalLabel}>{getFrequencyLabel(freq, interval)}</Text>
      </View>
    </View>
  );

  const renderWeeklySelector = () => {
    if (freq !== RRule.WEEKLY) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Repetir em</Text>
        <View style={styles.weekdayContainer}>
          {WEEKDAYS.map(day => (
            <TouchableOpacity
              key={day.value.weekday}
              style={[
                styles.weekdayButton,
                byweekday.some(d => d.weekday === day.value.weekday) && styles.weekdayButtonActive,
              ]}
              onPress={() => handleWeekdayToggle(day.value)}
            >
              <Text style={byweekday.some(d => d.weekday === day.value.weekday) ? styles.weekdayTextActive : styles.weekdayText}>
                  {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderMonthlySelector = () => {
    if (freq !== RRule.MONTHLY) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Repetir</Text>
        {/* Seletor de tipo: "No dia" vs "Na" */}
        <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => setMonthlyType('day_of_month')} style={[styles.toggleButton, monthlyType === 'day_of_month' && styles.toggleButtonActive]}>
                <Text style={styles.toggleText}>No dia do mês</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMonthlyType('day_of_week')} style={[styles.toggleButton, monthlyType === 'day_of_week' && styles.toggleButtonActive]}>
                <Text style={styles.toggleText}>No dia da semana</Text>
            </TouchableOpacity>
        </View>

        {monthlyType === 'day_of_month' && (
             <View style={styles.intervalContainer}>
                <Text>Dia:</Text>
                <TouchableOpacity onPress={() => setBymonthday(v => Math.max(1, v - 1))} style={styles.stepperButton}>
                    <Text style={styles.stepperText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.intervalValue}>{bymonthday}</Text>
                <TouchableOpacity onPress={() => setBymonthday(v => Math.min(31, v + 1))} style={styles.stepperButton}>
                    <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
            </View>
        )}
        
        {monthlyType === 'day_of_week' && (
            <View style={styles.pickerRow}>
                <Picker
                    selectedValue={monthlyOrdinal}
                    onValueChange={(itemValue) => setMonthlyOrdinal(itemValue)}
                    style={{ flex: 1 }}>
                    {MONTHLY_ORDINAL.map(item => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} color='#000000'/>
                    ))}
                </Picker>
                 <Picker
                    selectedValue={monthlyWeekday}
                    onValueChange={(itemValue) => setMonthlyWeekday(itemValue)}
                    style={{ flex: 1 }}>
                    {WEEKDAYS.map(day => (
                        <Picker.Item key={day.value.weekday} label={day.value.toString()} value={day.value} color='#000000'/>
                    ))}

                  
                </Picker>
            </View>
        )}
      </View>
    );
  };

  const renderEndConditionSelector = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Término</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setEndCondition('never')} style={[styles.toggleButton, endCondition === 'never' && styles.toggleButtonActive]}>
            <Text style={styles.toggleText}>Nunca</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEndCondition('on_date')} style={[styles.toggleButton, endCondition === 'on_date' && styles.toggleButtonActive]}>
            <Text style={styles.toggleText}>Em data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEndCondition('after_occurrences')} style={[styles.toggleButton, endCondition === 'after_occurrences' && styles.toggleButtonActive]}>
            <Text style={styles.toggleText}>Após</Text>
        </TouchableOpacity>
      </View>
      
      {endCondition === 'on_date' && (
          <View>
            <Button onPress={() => setShowDatePicker(true)} title={`Até ${until.toLocaleDateString()}`}/>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={until}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
          </View>
      )}

      {endCondition === 'after_occurrences' && (
        <View style={styles.intervalContainer}>
            <TouchableOpacity onPress={() => setCount(v => Math.max(1, v - 1))} style={styles.stepperButton}>
                <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.intervalValue}>{count}</Text>
            <TouchableOpacity onPress={() => setCount(v => v + 1)} style={styles.stepperButton}>
                <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.intervalLabel}>ocorrências</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: paddingTop, paddingBottom: 50 }}>
      <Text style={styles.title}>Definir Recorrência</Text>
      
      {/* Seletor de Frequência */}
      <View style={styles.section}>
        <Text style={styles.label}>Frequência</Text>
        <Picker
          selectedValue={freq}
          onValueChange={(itemValue) => setFreq(itemValue)}
        >
          {FREQUENCIES.map(f => (
            <Picker.Item key={f.value} label={f.label} value={f.value} color="#000000"/>
          ))}
        </Picker>
      </View>
      
      {renderIntervalSelector()}
      {renderWeeklySelector()}
      {renderMonthlySelector()}
      {renderEndConditionSelector()}

      {/* Resultado Final */}
      <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>String RRULE Gerada:</Text>
          <Text style={styles.resultString} selectable>{rruleString}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  // Intervalo e Contador
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  stepperText: {
    fontSize: 24,
    color: '#333',
  },
  intervalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  intervalLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  // Dias da Semana
  weekdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekdayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  weekdayButtonActive: {
    backgroundColor: '#007bff',
  },
  weekdayText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  weekdayTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
   // Botões de Toggle (Mensal e Término)
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleButtonActive: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    //color: '#007bff',
    color: "#000000",
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  // Resultado
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e88e5'
  },
  resultString: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default RRuleGenerator;