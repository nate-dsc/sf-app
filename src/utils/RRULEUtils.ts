import { RRule, Weekday } from "rrule"
import { monthShortDate } from "./DateUtils"

function ordinalToLabel(ordinal: number,  t: (key: string) => string) {
    const map: Record<number, string> = {
        1: t("describeRRULE.first"),
        2: t("describeRRULE.second"),
        3: t("describeRRULE.third"),
        4: t("describeRRULE.fourth"),
        5: t("describeRRULE.fifth"),
        [-2]: t("describeRRULE.penultimate"),
        [-1]: t("describeRRULE.last"),
    }
    return map[ordinal] || `${ordinal}`
}

export function describeRRule(rruleStr: string, t: (key: string) => string): string {
    const brokenString = rruleStr.split("\n")
    const cleanString = brokenString.length > 1 ? brokenString[1].replace("RRULE:", "") : rruleStr.replace("RRULE:", "")
    const rrule = new RRule(RRule.parseString(cleanString))
    const options = rrule.options
    const parts: string[] = []

    // Frequência
    const freqNames: Record<number, string[]> = {
        [RRule.YEARLY]: [t("describeRRULE.year"), t("describeRRULE.years")],
        [RRule.MONTHLY]: [t("describeRRULE.month"), t("describeRRULE.months")],
        [RRule.WEEKLY]: [t("describeRRULE.week"), t("describeRRULE.weeks")],
        [RRule.DAILY]: [t("describeRRULE.day"), t("describeRRULE.days")],
    }

    const weekdaysLabel = [
        t("describeRRULE.w2"),
        t("describeRRULE.w3"),
        t("describeRRULE.w4"),
        t("describeRRULE.w5"),
        t("describeRRULE.w6"),
        t("describeRRULE.w7"),
        t("describeRRULE.w1"),
        t("describeRRULE.day"),
        t("describeRRULE.weekday"),
        t("describeRRULE.weekendDay"),
    ]

    const monthsLabel = [
        t("describeRRULE.m1"), t("describeRRULE.m2"), t("describeRRULE.m3"),
        t("describeRRULE.m4"), t("describeRRULE.m5"), t("describeRRULE.m6"),
        t("describeRRULE.m7"), t("describeRRULE.m8"), t("describeRRULE.m9"),
        t("describeRRULE.m10"), t("describeRRULE.m11"), t("describeRRULE.m12")
    ]

    const freq = freqNames[options.freq] || ""
    parts.push(`${t("describeRRULE.every")} ${options.interval} ${options.interval > 1 ? freq[1] : freq[0]}`)

    if(options.freq === RRule.WEEKLY) {
        if (options.byweekday) {
            if(options.byweekday.length > 0) {
                const weekdayDescs = (options.byweekday as (number | Weekday)[]).map((wd) => {
                    if (typeof wd === "number") {
                    return weekdaysLabel[wd]
                    } else if (wd.n) {
                    // exemplo: RRule.SU.nth(1)
                    return `${ordinalToLabel(wd.n, t)} ${weekdaysLabel[wd.weekday]}`
                    } else {
                    return weekdaysLabel[wd.weekday]
                    }
                })
                parts.push(`${t("describeRRULE.onNo")} ${weekdayDescs.join(", ")}`)
            } 
        }
    }

    if(options.freq === RRule.MONTHLY) {
        if (options.byweekday) {
            switch(options.byweekday.length) {
                case 7: 
                    parts.push(`${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[7]}`)
                    break
                case 5: 
                    parts.push(`${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[8]}`)
                    break
                case 2: 
                    parts.push(`${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[9]}`)
                    break
                case 1: 
                    parts.push(`${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[options.byweekday[0]]}`)
                    break
            }
        } else if (options.bymonthday) {
            if(options.bymonthday.length > 0) {
                parts.push(`${t("describeRRULE.ondays")} ${options.bymonthday.join(", ")}`)
            }
        }
    }

    if(options.freq === RRule.YEARLY) {

        let yearlyStr = ""

        if (options.bymonth) {
            if(options.bymonth.length > 0) {
                const monthsDescs = (options.bymonth as (number)[]).map((mt) => {
                    if (typeof mt === "number") {
                        return monthsLabel[mt-1]
                    }
                })
                yearlyStr += `${t("describeRRULE.on")} ${monthsDescs.join(", ")},\n`
            } 
        }

        if (options.byweekday) {
            switch(options.byweekday.length) {
                case 7: 
                    yearlyStr += `${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[7]}`
                    break
                case 5: 
                    yearlyStr += `${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[8]}`
                    break
                case 2: 
                    yearlyStr += `${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[9]}`
                    break
                case 1: 
                    yearlyStr += `${t("describeRRULE.onthe")} ${ordinalToLabel(options.bysetpos[0], t)} ${weekdaysLabel[options.byweekday[0]]}`
                    break
            }
        } else if (options.bymonthday) {
            if(options.bymonthday.length > 0) {
                yearlyStr += `${t("describeRRULE.ondays")} ${options.bymonthday.join(", ")}`
            }
        }

        parts.push(yearlyStr)
    }



    // Limite
    if (options.until) {
        const d = options.until
        parts.push(
            `${t("describeRRULE.until")} ${monthShortDate(d)}.`
        )
    } else if (options.count) {
        parts.push(`${t("describeRRULE.untilRepeats")} ${options.count} ${options.count > 1 ? t("describeRRULE.times") : t("describeRRULE.time")}.`)
    } else {
        parts.push(`${t("describeRRULE.indefinitely")}.`)
    }

    return parts.join(",\n")
}
