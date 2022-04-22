import { createContext, Dispatch } from 'react'

const noop = () => void 0

export const AppContext = createContext({
  username: '',
  setUsername: noop as Dispatch<React.SetStateAction<string>>,
})
