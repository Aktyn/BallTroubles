import { createContext } from 'react'
import { GameProgress, GAME_MODE } from '../utils'

const noop = () => void 0

export const AppContext = createContext({
  username: '',
  setUsername: noop as (username: string) => void,
  gameProgress: {
    [GAME_MODE.TUTORIAL]: { completedBy: [] },
    [GAME_MODE.CAMPAIGN]: {},
    [GAME_MODE.SURVIVAL]: {},
  } as GameProgress,
  setGameProgress: noop as (progress: GameProgress) => void,
})

export type AppContextSchema = typeof AppContext extends React.Context<
  infer Schema
>
  ? Schema
  : never
