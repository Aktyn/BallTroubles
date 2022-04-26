import { GAME_MODE, GAME_MAP } from '../../../utils'

export enum MENU_MODE {
  HOME,
  CAMPAIGN,
  SURVIVAL,
  TUTORIAL,
  HIGHSCORES,
}

export interface CommonMenuModeProperties {
  onModeChange: React.Dispatch<React.SetStateAction<MENU_MODE>>
  onStartGame?: (mode: GAME_MODE, map: GAME_MAP) => void
}
