import { useState } from 'react'
import { tryParseJSON } from '../utils'

export const useStorageState = <ValueType>(
  storageKey: string,
  defaultValue: ValueType,
): [ValueType, (value: ValueType) => void] => {
  const rawStorageValue = localStorage.getItem(storageKey)
  const initialValue = rawStorageValue
    ? tryParseJSON(rawStorageValue)
    : defaultValue

  const [value, setValue] = useState(initialValue)

  const setStorageValue = (newValue: ValueType) => {
    localStorage.setItem(storageKey, JSON.stringify(newValue))
    setValue(newValue)
  }

  return [value, setStorageValue]
}
