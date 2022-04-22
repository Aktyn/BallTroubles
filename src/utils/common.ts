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

export enum GAME_MODE {
  TUTORIAL,
  CAMPAIGN,
  SURVIVAL,
}

export enum GAME_MAP {
  MAP1 = 'map-1',
  MAP2 = 'map-2',
  MAP3 = 'map-3',
}
