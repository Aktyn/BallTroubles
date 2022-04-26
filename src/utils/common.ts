/* eslint-disable i18next/no-literal-string */
import { TranslationKey } from '../i18n'

export function isDev() {
  return process.env.NODE_ENV === 'development'
}

export function tryParseJSON(json: string) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

/** NOTE: this enum must be string enum due to JSON parsing properties */
export enum GAME_MODE {
  TUTORIAL = 'tutorial',
  CAMPAIGN = 'campaign',
  SURVIVAL = 'survival',
}

/** NOTE: this enum must be string enum due to JSON parsing properties */
export enum GAME_MAP {
  MAP1 = 'map-1',
  MAP2 = 'map-2',
  MAP3 = 'map-3',
  TUTORIAL = 'tutorial', //should be last entry
}

export interface GameProgress {
  [GAME_MODE.TUTORIAL]: {
    /** List of users that completed tutorial */
    completedBy: string[]
  }
  [GAME_MODE.CAMPAIGN]: {
    [mapId in Exclude<GAME_MAP, 'tutorial'>]?: {
      results: {
        username: string
        bestScore: number
        completed: boolean
      }[]
    }
  }
  [GAME_MODE.SURVIVAL]: {
    [mapId in Exclude<GAME_MAP, 'tutorial'>]?: {
      results: {
        username: string
        /** Milliseconds */
        bestTime: number
      }[]
    }
  }
}

interface GameMapInfo {
  name: TranslationKey
  preview?: string
}

export const gameMapsInfo: {
  [key in GAME_MAP]: GameMapInfo
} = {
  [GAME_MAP.MAP1]: {
    name: 'map:map1',
    //TODO: get each map screenshot and use it as preview
    preview: require('../assets/textures/maps/map1.webp'),
  },
  [GAME_MAP.MAP2]: {
    name: 'map:map2',
    preview: require('../assets/textures/maps/map2.webp'),
  },
  [GAME_MAP.MAP3]: {
    name: 'map:map3',
    preview: require('../assets/textures/maps/map3.webp'),
  },
  [GAME_MAP.TUTORIAL]: {
    name: 'map:tutorial',
  },
}

export const gameModesInfo: {
  [key in GAME_MODE]: { name: TranslationKey }
} = {
  [GAME_MODE.CAMPAIGN]: {
    name: 'menu:gameMode.campaign.title',
  },
  [GAME_MODE.SURVIVAL]: {
    name: 'menu:gameMode.survival.title',
  },
  [GAME_MODE.TUTORIAL]: {
    name: 'menu:gameMode.tutorial.title',
  },
}
