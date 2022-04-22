/* eslint-disable i18next/no-literal-string */
import { TranslationKey } from '../../../i18n'
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

interface GameMapInfo {
  name: TranslationKey
  preview: string
}

export const gameMapsInfo: { [key in GAME_MAP]: GameMapInfo } = {
  [GAME_MAP.MAP1]: {
    name: 'map:map1',
    //TODO: get each map screenshot and use it as preview
    preview: require('../../../assets/textures/maps/map1.webp'),
  },
  [GAME_MAP.MAP2]: {
    name: 'map:map2',
    preview: require('../../../assets/textures/maps/map1.webp'),
  },
  [GAME_MAP.MAP3]: {
    name: 'map:map3',
    preview: require('../../../assets/textures/maps/map1.webp'),
  },
}
