import { Dispatch, useState } from 'react'
import { tryParseJSON } from '../utils'

export const useStorageState = <ValueType>(
  storageKey: string,
  defaultValue: ValueType,
): [ValueType, Dispatch<React.SetStateAction<ValueType>>] => {
  const rawStorageValue = localStorage.getItem('username')
  const initialValue = rawStorageValue
    ? tryParseJSON(rawStorageValue)
    : defaultValue

  const [value, setValue] = useState(initialValue)

  const setStorageValue = (newValue: ValueType) => {
    localStorage.setItem(storageKey, JSON.stringify(newValue))
    setValue(newValue)
  }

  return [value, setStorageValue as Dispatch<React.SetStateAction<ValueType>>]
}
