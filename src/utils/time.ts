/* eslint-disable i18next/no-literal-string */
import i18next from 'i18next'
import { TranslationKey } from '../i18n'

export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const WEEK = DAY * 7
export const MONTH = DAY * 30

const units = ['millisecond', 'second', 'minute', 'hour', 'day'] as const
type TimeUnit = typeof units[number]

const unitInfo: {
  [key in TimeUnit]: {
    length: number
    shortKey: TranslationKey
    minDigits: number
  }
} = {
  millisecond: {
    length: 1,
    shortKey: 'time:shortUnit.millisecond',
    minDigits: 4,
  },
  second: { length: SECOND, shortKey: 'time:shortUnit.second', minDigits: 2 },
  minute: { length: MINUTE, shortKey: 'time:shortUnit.minute', minDigits: 2 },
  hour: { length: HOUR, shortKey: 'time:shortUnit.hour', minDigits: 2 },
  day: { length: DAY, shortKey: 'time:shortUnit.day', minDigits: 1 },
}

export function parseTime(milliseconds: number, roundTo: TimeUnit = 'second') {
  const parsed: string[] = []

  let first = true

  for (const unit of [...units].reverse()) {
    if (milliseconds < unitInfo[unit].length && unit !== roundTo) {
      continue
    }
    const value = Math.floor(milliseconds / unitInfo[unit].length)
    milliseconds -= value * unitInfo[unit].length

    let parsedValue = value.toString()
    if (!first) {
      parsedValue = parsedValue.padStart(unitInfo[unit].minDigits, '0')
    }

    parsed.push(`${parsedValue}${i18next.t(unitInfo[unit].shortKey)}`)

    first = false

    if (unit === roundTo) {
      break
    }
  }

  return parsed.join(' ')
}
