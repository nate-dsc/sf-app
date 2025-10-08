import DatePicker from '@/components/menu-items/DatePicker';
import DayPicker from '@/components/menu-items/DayPicker';
import MSList from '@/components/menu-items/ListMultipleSelection';
import SSList from '@/components/menu-items/ListSingleSelection';
import { MIStyles } from '@/components/menu-items/MenuItemStyles';
import SegmentedControl, { SCOption } from '@/components/menu-items/SegmentedControl';
import Stepper from '@/components/menu-items/Stepper';
import { FontStyles } from '@/components/styles/FontStyles';
import { useNewTransaction } from '@/context/NewTransactionContext';
import { useTheme } from '@/context/ThemeContext';
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Frequency, Options, RRule, Weekday } from 'rrule';

// Tipos para clareza
type EndCondition = "never" | "on_date" | "after_occurrences"
type MonthlyType = "day_of_month" | "day_of_week"

// Constantes para as opções da UI
const FREQUENCIES = [
    { label: 'Diário', value: RRule.DAILY },
    { label: 'Semanal', value: RRule.WEEKLY },
    { label: 'Mensal', value: RRule.MONTHLY },
    { label: 'Anual', value: RRule.YEARLY },
]

const END_CONDITIONS: SCOption<EndCondition>[] = [
    { label: "Nunca", value: "never"},
    { label: "No dia", value: "on_date"},
    { label: "Após vezes", value: "after_occurrences"},
]

const WEEKDAYS = [
    { id: "1", label: 'Domingo', value: RRule.SU },
    { id: "2", label: 'Segunda-feira', value: RRule.MO },
    { id: "3", label: 'Terça-feira', value: RRule.TU },
    { id: "4", label: 'Quarta-feira', value: RRule.WE },
    { id: "5", label: 'Quinta-feira', value: RRule.TH },
    { id: "6", label: 'Sexta-feira', value: RRule.FR },
    { id: "7", label: 'Sábado', value: RRule.SA },
]

const WEEKDAYS_FOR_MONTHLY_FREQUENCY = [
    { id: "1", label: 'Domingo', value: [RRule.SU] },
    { id: "2", label: 'Segunda-feira', value: [RRule.MO] },
    { id: "3", label: 'Terça-feira', value: [RRule.TU] },
    { id: "4", label: 'Quarta-feira', value: [RRule.WE] },
    { id: "5", label: 'Quinta-feira', value: [RRule.TH] },
    { id: "6", label: 'Sexta-feira', value: [RRule.FR] },
    { id: "7", label: 'Sábado', value: [RRule.SA] },
    { id: "8", label: 'Dia de semana', value: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR] },
    { id: "9", label: 'Sáb./Dom.', value: [RRule.SA, RRule.SU] }
]

const MONTHLY_TYPE: {label: string, value: MonthlyType}[] = [
    { label: "Dia do mês", value: "day_of_month"},
    { label: "Dia da semana", value: "day_of_week"}
]

const MONTHLY_ORDINAL = [
    { id: "1", label: 'Primeira', value: 1 },
    { id: "2", label: 'Segunda', value: 2 },
    { id: "3", label: 'Terceira', value: 3 },
    { id: "4", label: 'Quarta', value: 4 },
    { id: "5", label: 'Quinta', value: 5 },
    { id: "-2", label: 'Penúltima', value: -2 },
    { id: "-1", label: 'Última', value: -1 },
]

export default function ModalRecurring() {

    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const {theme, preference, setPreference} = useTheme()
    const menuStyles = MIStyles(theme)
    const {newTransaction, updateNewTransaction} = useNewTransaction()

    // --- Estados da UI ---
    const [freq, setFreq] = useState<Frequency>(RRule.DAILY)
    const [interval, setInterval] = useState(1)
    const [endCondition, setEndCondition] = useState<EndCondition>('never')
    const [count, setCount] = useState(5)
    const [until, setUntil] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    // Estado para recorrência semanal
    const [byweekday, setByweekday] = useState<Weekday[]>(() => {
        const todayItem = WEEKDAYS[new Date().getDay()]
        return [todayItem.value];
    })

    // Estados para recorrência mensal
    const [monthlyType, setMonthlyType] = useState<MonthlyType>('day_of_month')
    const [bymonthday, setBymonthday] = useState<number []>([new Date().getDate()])
    const [monthlyOrdinal, setMonthlyOrdinal] = useState(1)
    const [monthlyWeekday, setMonthlyWeekday] = useState<Weekday[]>([RRule.SU])

    const scrollRef = useRef<ScrollView>(null);
    const scrollPos = useRef(0);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => scrollPos.current = e.nativeEvent.contentOffset.y;

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: scrollPos.current, animated: false });
    }, [endCondition,monthlyType]);

    // --- Estado Final ---

    // Hook para gerar a string RRULE sempre que uma opção mudar
    const rruleString = useMemo(() => {
        const options: Partial<Options> = {
            freq,
            interval,
            dtstart: newTransaction.date, // Importante para o contexto da regra
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
                options.bymonthday = bymonthday.length === 1 ? bymonthday[0] : bymonthday
            } else {
                options.byweekday = monthlyWeekday.map((wkd) => wkd.nth(monthlyOrdinal));
            }
        }

        try {
            const rule = new RRule(options);
            return rule.toString()
        } catch (e) {
            console.error("Erro ao gerar RRULE:", e);
            return("Regra inválida");
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

    const selectedIds = byweekday.map(day => {
        const foundItem = WEEKDAYS.find(item => item.value.weekday === day.weekday)
        return foundItem!.id; // O '!' é seguro aqui, pois sabemos que o item sempre existirá
    })

    // --- Handlers de Interação ---
    const handleDayPress = useCallback((day: number) => {
        setBymonthday(prevSelectedDays => {
        const alreadySelected = prevSelectedDays.includes(day)

        if(alreadySelected) {
            if(prevSelectedDays.length === 1) {return prevSelectedDays}
            return (prevSelectedDays.filter((d) => d !== day))
        } else {
            return [...prevSelectedDays, day].sort((a,b) => a-b)
        }
        })
    },[])

    const handleWeekdayToggle = (id: string, day: Weekday) => {
        setByweekday(prev => {
            //O novo elemento está na array?
            const isSelected = prev.some(d => d.weekday === day.weekday);
            //Se sim
            if (isSelected) {
                // Não permite desmarcar o último dia
                if (prev.length === 1) return prev;
                return prev.filter(d => d.weekday !== day.weekday);
            } else {
                return [...prev, day].sort((a,b) => a.weekday - b.weekday);
            }
        })
    }

    const onDateChange = (selectedDate?: Date) => {
        const currentDate = selectedDate || until;
        setUntil(currentDate);
    }

    const getFrequencyLabels = (f: Frequency) => {
        switch(f) {
            case Frequency.DAILY: return(["dia", "dias"])
            case Frequency.WEEKLY: return(["semana", "semanas"])
            case Frequency.MONTHLY: return(["mês", "meses"])
            case Frequency.YEARLY: return(["ano", "anos"])
            default: return(["", ""])
        }
    }

    // --- Componentes de Renderização ---

    const renderIntervalSelector = () => (
        <Stepper
            singular={getFrequencyLabels(freq)[0]} 
            plural={getFrequencyLabels(freq)[1]} 
            min={1} 
            max={365} 
            value={interval} 
            onValueChange={(newValue) => setInterval(newValue)}
        />
    )

    const renderWeeklySelector = () => {
        if (freq !== RRule.WEEKLY) return null;
        return (
            <View style={{rowGap: 12}}>
                <Text style={[FontStyles.headline, menuStyles.text]}>No(a)...</Text>
                <MSList
                items={WEEKDAYS}
                onSelect={(id: string, value: Weekday) => handleWeekdayToggle(id, value)}
                selectedIds={selectedIds}
                />
            </View>
        )
    }

    const renderMonthlySelector = () => {
        if (freq !== RRule.MONTHLY) return <View/>;
        return (
            <View style={{rowGap: 12}}>
                <Text style={[FontStyles.headline, menuStyles.text]}>No...</Text>
                <SegmentedControl options={MONTHLY_TYPE} selectedValue={monthlyType} onChange={(value) => setMonthlyType(value)} />

                
                <View style={{ display: monthlyType === 'day_of_month' ? 'flex' : 'none', gap: 12 }}>
                    <Text style={[FontStyles.headline, menuStyles.text]}>No(s) dia(s)...</Text>
                    <DayPicker selectedDays={bymonthday} onDayPress={handleDayPress} />
                </View>

                <View style={{ display: monthlyType === 'day_of_week' ? 'flex' : 'none', gap: 12 }}>
                    <Text style={[FontStyles.headline, menuStyles.text]}>No(a)...</Text>
                    <View style={{ flexDirection: "row", gap: 12}}>
                        <View style={{flex: 1}}>
                            <SSList
                                items={MONTHLY_ORDINAL}
                                selectedId={MONTHLY_ORDINAL.find(item => item.value === monthlyOrdinal)?.id}
                                onSelect={(id: string, label: string, value: number) => setMonthlyOrdinal(value)}
                                compact={true}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <SSList
                                items={WEEKDAYS_FOR_MONTHLY_FREQUENCY}
                                selectedId={WEEKDAYS_FOR_MONTHLY_FREQUENCY.find(item => item.value === monthlyWeekday)?.id || "1"}
                                onSelect={(id, label, value) => setMonthlyWeekday(value)}
                                compact={true}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderEndConditionSelector = () => (
    <View style={{gap: 12}}>
        <Text style={[FontStyles.headline, menuStyles.text]}>Termina...</Text>
        <SegmentedControl 
            options={END_CONDITIONS} 
            selectedValue={endCondition} 
            onChange={(value: EndCondition) => setEndCondition(value)} 
        />

        <View style={{ display: endCondition === 'on_date' ? 'flex' : 'none' }}>
            <DatePicker text={"No dia"} value={until} onDateChange={onDateChange} />
        </View>

        <View style={{ display: endCondition === 'after_occurrences' ? 'flex' : 'none' }}>
            <Stepper singular={"ocorrência"} plural={"ocorrências"} min={1} max={720} value={count} onValueChange={(value) => setCount(value)} />
        </View>

        </View>
    )

    return (
        <ScrollView 
            contentContainerStyle={[{paddingTop: paddingTop}, {paddingHorizontal: 20, paddingBottom: insets.bottom, rowGap: 12}]}
            ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16}
        >
            <Text style={[FontStyles.headline, menuStyles.text]}>Frequência</Text>
            <SegmentedControl
                options={FREQUENCIES}
                selectedValue={freq}
                onChange={(optionValue) => setFreq(optionValue)}
            />
            <Text style={[FontStyles.headline, menuStyles.text]}>A cada...</Text>
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
    )
};

const styles = StyleSheet.create({
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
})