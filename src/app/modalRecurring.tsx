import LabeledButton from '@/components/buttons/LabeledButton';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import GDateInput from '@/components/grouped-list-components/GroupedDateInput';
import GSelectionList from '@/components/grouped-list-components/GroupedSelectionList';
import DayPicker from '@/components/recurrence-modal-items/DayPicker';
import MonthPicker from '@/components/recurrence-modal-items/MonthPicker';
import SegmentedControlCompact from '@/components/recurrence-modal-items/SegmentedControlCompact';
import Stepper from '@/components/recurrence-modal-items/Stepper';
import { useNewTransaction } from '@/context/NewTransactionContext';
import { useStyle } from '@/context/StyleContext';
import { SCOption } from '@/types/components';
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Frequency, Options, RRule, Weekday } from 'rrule';

// Tipos para clareza
type EndCondition = "never" | "on_date" | "after_occurrences"
type MonthlyType = "day_of_month" | "day_of_week"



export default function ModalRecurring() {

    const {t} = useTranslation()
    const router = useRouter()
    const {newTransaction, updateNewTransaction} = useNewTransaction()
    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const {theme, layout} = useStyle()

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
            <TouchableOpacity
                onPress={() => {
                    updateNewTransaction({rrule: undefined})
                    router.back()
                }}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: layout.radius.round,
                    paddingVertical: 13,
                    backgroundColor: theme.fill.secondary
                }}
            >
                <Text style={{lineHeight: 22, fontSize: 17, fontWeight: "500", color: theme.colors.red}}>
                    {t("modalRecurring.disable")}
                </Text>
            </TouchableOpacity>
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
            <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.onthe")}
                    </Text>
                </View>
                
                <GSelectionList
                    items={WEEKDAYS}
                    selectedIds={selectedIds}
                    onSelect={(id, label, value) => handleWeekdayToggle(id, value)}
                />
            </View>
        )
    }

    const renderMonthSelector = () => {
        if (freq !== RRule.YEARLY) return null
        return (
            <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.onmonths")}
                    </Text>
                </View>
                
                <MonthPicker
                    selectedMonths={bymonth}
                    onMonthPress={handleMonthPress}
                />
            </View>
        )
    }

    const renderMonthlySelector = () => {
        if (freq !== RRule.MONTHLY && freq !== RRule.YEARLY) return <View/>;
        return (
            <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.on")}
                    </Text>
                </View>

                <SegmentedControlCompact options={MONTHLY_TYPE} selectedValue={monthlyType} onChange={(value) => setMonthlyType(value)} />
                
                <View style={{ display: monthlyType === 'day_of_month' ? 'flex' : 'none'}}>
                    <DayPicker selectedDays={bymonthday} onDayPress={handleDayPress} />
                </View>

                <View style={{ display: monthlyType === 'day_of_week' ? 'flex' : 'none'}}>
                    <View style={{ flexDirection: "row", gap: layout.margin.contentArea}}>
                        <View style={{flex: 1}}>
                            <GSelectionList
                                singleSelect
                                items={MONTHLY_ORDINAL}
                                selectedIds={MONTHLY_ORDINAL.flatMap(item => item.value === monthlyOrdinal ? [item.id] : [])
                                }
                                onSelect={(id, label, value) => setMonthlyOrdinal(value)}
                                showIcons={false}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <GSelectionList
                                singleSelect
                                items={WEEKDAYS_FOR_MONTHLY_FREQUENCY}
                                selectedIds={
                                    WEEKDAYS_FOR_MONTHLY_FREQUENCY.flatMap(item =>
                                    ((item.value.length === monthlyWeekday.length) &&
                                    (item.value.every((v, i) => v.weekday === monthlyWeekday[i].weekday))) ? [item.id] : [])
                                }
                                onSelect={(id, label, value) => setMonthlyWeekday(value)}
                                showIcons={false}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderEndConditionSelector = () => (
        <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.ends")}
                    </Text>
                </View>

                <SegmentedControlCompact 
                    options={END_CONDITIONS} 
                    selectedValue={endCondition} 
                    onChange={(value: EndCondition) => setEndCondition(value)} 
                />
                
                <View style={{ display: endCondition === 'on_date' ? 'flex' : 'none' }}>
                    <View 
                        style={{
                            paddingHorizontal: layout.margin.contentArea,
                            borderRadius: layout.radius.groupedView,
                            backgroundColor: theme.fill.secondary
                        }}
                    >
                        <GDateInput 
                            separator={"none"}
                            leadingLabel={t("modalRecurring.enddate")}
                            value={until}
                            onDateChange={onDateChange}
                        />
                    </View>
                </View>

                <View style={{ display: endCondition === 'after_occurrences' ? 'flex' : 'none' }}>
                    <Stepper
                        singular={t("modalRecurring.occurrence")}
                        plural={t("modalRecurring.occurrences")}
                        min={1}
                        max={720}
                        value={count}
                        onValueChange={(value) => setCount(value)}
                    />
                </View>
        </View>
    )

    const handleConfirm = () => {
        const splitStr = rruleString.split("\n")[1]
        const finalStr = splitStr.replace("RRULE:", "")
        updateNewTransaction({rrule: finalStr})
        router.back()
    }

    return (
        <ScrollView 
            contentContainerStyle={{
                flex: 1,
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: 100,
                gap: layout.margin.sectionGap
            }}
            ref={scrollRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            {renderResetButton()}
            <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.frequency")}
                    </Text>
                </View>
                
                <SegmentedControlCompact
                    options={FREQUENCIES}
                    selectedValue={freq}
                    onChange={(optionValue) => setFreq(optionValue)}
                />
            </View>

            <View style={{gap: layout.margin.innerSectionGap}}>
                <View style={{paddingHorizontal: layout.margin.contentArea}}>
                    <Text
                        style={{lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    >
                        {t("modalRecurring.every")}
                    </Text>
                </View>
                
                {renderIntervalSelector()}
            </View>

            {renderWeeklySelector()}

            {renderMonthSelector()}
            {renderMonthlySelector()}
            {renderEndConditionSelector()}

            
            <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{flex: 1}}>
                    <LabeledButton
                        label={t("buttons.cancel")}
                        onPress={() => {router.back()}}
                    />
                </View>
                <View style={{flex: 1}}>
                    <PrimaryButton
                        label={t("buttons.save")}
                        onPress={handleConfirm}
                    />
                </View>
            </View>
        </ScrollView>
    )
};