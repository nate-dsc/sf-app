import CancelButton from '@/components/buttons/CancelButton';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import DatePicker from '@/components/menu-items/DatePicker';
import DayPicker from '@/components/menu-items/DayPicker';
import MSList from '@/components/menu-items/ListMultipleSelection';
import SSList from '@/components/menu-items/ListSingleSelection';
import { MIStyles } from '@/components/menu-items/MenuItemStyles';
import MonthPicker from '@/components/menu-items/MonthPicker';
import SegmentedControlCompact, { SCOption } from '@/components/menu-items/SegmentedControlCompact';
import Stepper from '@/components/menu-items/Stepper';
import { FontStyles } from '@/components/styles/FontStyles';
import { useNewTransaction } from '@/context/NewTransactionContext';
import { useStyle } from '@/context/StyleContext';
import { describeRRule } from '@/utils/RRULEUtils';
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Frequency, Options, RRule, Weekday } from 'rrule';

// Tipos para clareza
type EndCondition = "never" | "on_date" | "after_occurrences"
type MonthlyType = "day_of_month" | "day_of_week"



export default function ModalRecurring() {

    const {t} = useTranslation()
    const router = useRouter()
    const {newTransaction, updateNewTransaction, setNewTransaction, saveTransaction, isValid} = useNewTransaction()
    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const {theme, preference, setPreference} = useStyle()
    const menuStyles = MIStyles(theme)

    // Constantes para as opções da UI
    const FREQUENCIES = [
        { label: t("modalRecurring.daily"), value: RRule.DAILY },
        { label: t("modalRecurring.weekly"), value: RRule.WEEKLY },
        { label: t("modalRecurring.monthly"), value: RRule.MONTHLY },
        { label: t("modalRecurring.yearly"), value: RRule.YEARLY },
    ]

    const END_CONDITIONS: SCOption<EndCondition>[] = [
        { label: t("modalRecurring.never"), value: "never"},
        { label: t("modalRecurring.ondate"), value: "on_date"},
        { label: t("modalRecurring.after"), value: "after_occurrences"},
    ]

    const WEEKDAYS = [
        { id: "1", label: t("modalRecurring.w1"), value: RRule.SU },
        { id: "2", label: t("modalRecurring.w2"), value: RRule.MO },
        { id: "3", label: t("modalRecurring.w3"), value: RRule.TU },
        { id: "4", label: t("modalRecurring.w4"), value: RRule.WE },
        { id: "5", label: t("modalRecurring.w5"), value: RRule.TH },
        { id: "6", label: t("modalRecurring.w5"), value: RRule.FR },
        { id: "7", label: t("modalRecurring.w7"), value: RRule.SA },
    ]

    const WEEKDAYS_FOR_MONTHLY_FREQUENCY = [
        { id: "1", label: t("modalRecurring.w1"), value: [RRule.SU] },
        { id: "2", label: t("modalRecurring.w2"), value: [RRule.MO] },
        { id: "3", label: t("modalRecurring.w3"), value: [RRule.TU] },
        { id: "4", label: t("modalRecurring.w4"), value: [RRule.WE] },
        { id: "5", label: t("modalRecurring.w5"), value: [RRule.TH] },
        { id: "6", label: t("modalRecurring.w6"), value: [RRule.FR] },
        { id: "7", label: t("modalRecurring.w7"), value: [RRule.SA] },
        { id: "8", label: t("modalRecurring.Day"), value: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU] },
        { id: "9", label: t("modalRecurring.weekday"), value: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR] },
        { id: "10", label: t("modalRecurring.weekendDay"), value: [RRule.SA, RRule.SU] }
    ]

    const MONTHLY_TYPE: {label: string, value: MonthlyType}[] = [
        { label: t("modalRecurring.daysofmonth"), value: "day_of_month"},
        { label: t("modalRecurring.daysofweek"), value: "day_of_week"}
    ]
    const MONTHLY_ORDINAL = [
        { id: "1", label: t("modalRecurring.first"), value: 1 },
        { id: "2", label: t("modalRecurring.second"), value: 2 },
        { id: "3", label: t("modalRecurring.third"), value: 3 },
        { id: "4", label: t("modalRecurring.fourth"), value: 4 },
        { id: "5", label: t("modalRecurring.fifth"), value: 5 },
        { id: "-2", label: t("modalRecurring.penultimate"), value: -2 },
        { id: "-1", label: t("modalRecurring.last"), value: -1 },
    ]

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

    // Estados para recorrência anual
    const [bymonth, setBymonth] = useState<number []>([new Date().getMonth()])

    const scrollRef = useRef<ScrollView>(null);
    const scrollPos = useRef(0);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => scrollPos.current = e.nativeEvent.contentOffset.y;

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: scrollPos.current, animated: false });
    }, [endCondition, monthlyType, monthlyOrdinal, monthlyWeekday]);

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
            options.wkst = RRule.SU
            if (byweekday.length > 0) {
                options.byweekday = byweekday;
            }
        } else if (freq === RRule.MONTHLY) {
            if (monthlyType === 'day_of_month') {
                options.bymonthday = bymonthday.length === 1 ? bymonthday[0] : bymonthday
            } else {
                options.byweekday = monthlyWeekday
                options.bysetpos = monthlyOrdinal
            }
        } else if (freq === RRule.YEARLY) {
            options.bymonth = bymonth.map((month) => month + 1)
            if (monthlyType === 'day_of_month') {
                options.bymonthday = bymonthday.length === 1 ? bymonthday[0] : bymonthday
            } else {
                options.byweekday = monthlyWeekday
                options.bysetpos = monthlyOrdinal
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
        bymonth,
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

    const handleMonthPress = useCallback((month: number) => {
        setBymonth(prevSelectedMonths => {
        const alreadySelected = prevSelectedMonths.includes(month)

        if(alreadySelected) {
            if(prevSelectedMonths.length === 1) {return prevSelectedMonths}
            return (prevSelectedMonths.filter((m) => m !== month))
        } else {
            return [...prevSelectedMonths, month].sort((a,b) => a-b)
        }
        })
    },[])

    const handleWeekdayToggle = useCallback((id: string, day: Weekday) => {
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
    },[])

    const onDateChange = (selectedDate?: Date) => {
        const currentDate = selectedDate || until;
        setUntil(currentDate);
    }

    const getFrequencyLabels = (f: Frequency) => {
        switch(f) {
            case Frequency.DAILY: return([t("modalRecurring.day"), t("modalRecurring.days")])
            case Frequency.WEEKLY: return([t("modalRecurring.week"), t("modalRecurring.weeks")])
            case Frequency.MONTHLY: return([t("modalRecurring.month"), t("modalRecurring.months")])
            case Frequency.YEARLY: return([t("modalRecurring.year"), t("modalRecurring.years")])
            default: return(["", ""])
        }
    }

    // --- Componentes de Renderização ---

    const renderResetButton = () => {
        if (!newTransaction.rrule) return null
        return(
            <CancelButton buttonText={t("modalRecurring.disable")} onPress={() => {
                updateNewTransaction({rrule: undefined})
                router.back()
            }}/>
        )
    }

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
            <View style={{rowGap: 10}}>
                <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.onthe")}</Text>
                <MSList
                items={WEEKDAYS}
                onSelect={(id: string, value: Weekday) => handleWeekdayToggle(id, value)}
                selectedIds={selectedIds}
                />
            </View>
        )
    }

    const renderMonthSelector = () => {
        if (freq !== RRule.YEARLY) return null
        return (
            <View style={{rowGap: 10}}>
                <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.onmonths")}</Text>
                <MonthPicker selectedMonths={bymonth} onMonthPress={handleMonthPress} />
            </View>
        )
    }

    const renderMonthlySelector = () => {
        if (freq !== RRule.MONTHLY && freq !== RRule.YEARLY) return <View/>;
        return (
            <View style={{rowGap: 10}}>
                <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.on")}</Text>
                <SegmentedControlCompact options={MONTHLY_TYPE} selectedValue={monthlyType} onChange={(value) => setMonthlyType(value)} />

                
                <View style={{ display: monthlyType === 'day_of_month' ? 'flex' : 'none', gap: 12 }}>
                    <DayPicker selectedDays={bymonthday} onDayPress={handleDayPress} />
                </View>

                <View style={{ display: monthlyType === 'day_of_week' ? 'flex' : 'none', gap: 12 }}>
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
                                selectedId={WEEKDAYS_FOR_MONTHLY_FREQUENCY.find(
                                    item =>
                                    item.value.length === monthlyWeekday.length &&
                                    item.value.every((v, i) => v.weekday === monthlyWeekday[i].weekday)
                                )?.id}
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
    <View style={{gap: 10}}>
        <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.ends")}</Text>
        <SegmentedControlCompact 
            options={END_CONDITIONS} 
            selectedValue={endCondition} 
            onChange={(value: EndCondition) => setEndCondition(value)} 
        />

        <View style={{ display: endCondition === 'on_date' ? 'flex' : 'none' }}>
            <DatePicker text={t("modalRecurring.enddate")} value={until} onDateChange={onDateChange} />
        </View>

        <View style={{ display: endCondition === 'after_occurrences' ? 'flex' : 'none' }}>
            <Stepper singular={t("modalRecurring.occurrence")} plural={t("modalRecurring.occurrences")} min={1} max={720} value={count} onValueChange={(value) => setCount(value)} />
        </View>

        </View>
    )

    const handleConfirm = () => {
        const splitStr = rruleString.split("\n")[1]
        const finalStr = splitStr.replace("RRULE:", "")
        const rruleDescription = describeRRule(rruleString, t)
        updateNewTransaction({rrule: finalStr, rruleDescription: rruleDescription})
        router.back()
    }

    return (
        <ScrollView 
            contentContainerStyle={[{paddingTop: paddingTop}, {paddingHorizontal: 20, paddingBottom: insets.bottom+30, rowGap: 10}]}
            ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16}
        >
            {renderResetButton()}
            <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.frequency")}</Text>
            <SegmentedControlCompact
                options={FREQUENCIES}
                selectedValue={freq}
                onChange={(optionValue) => setFreq(optionValue)}
            />
            <Text style={[FontStyles.body, menuStyles.text]}>{t("modalRecurring.every")}</Text>
            {renderIntervalSelector()}
            {renderWeeklySelector()}
            {renderMonthSelector()}
            {renderMonthlySelector()}
            {renderEndConditionSelector()}

            <View style={{flexDirection: "row", columnGap: 12}}>
                <CancelButton buttonText={t("buttons.cancel")} onPress={() => {router.back()}}/>
                <ConfirmButton buttonText={t("buttons.save")} onPress={handleConfirm} />
            </View>
        </ScrollView>
    )
};