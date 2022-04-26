import { useContext, useEffect, useState } from 'react'
import { mdiPlay } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../../context/appContext'
import { GAME_MODE, GAME_MAP, gameMapsInfo } from '../../../utils'
import { MapTile } from './MapTile'
import { MenuModeCommonHeader } from './MenuModeCommonHeader'
import { CommonMenuModeProperties } from './common'

import './MenuCampaignSurvivalMode.scss'

type REGULAR_GAME_MAP = Exclude<GAME_MAP, 'tutorial'>

export const MenuSurvivalMode = ({
  onModeChange,
  onStartGame,
}: CommonMenuModeProperties) => {
  const [t] = useTranslation()

  const app = useContext(AppContext)

  interface UserSurvivalResult {
    gameMap: REGULAR_GAME_MAP
    bestTime: number | null
    completed: boolean
  }

  const [selectedMap, setSelectedMap] = useState<REGULAR_GAME_MAP | null>(null)
  const [userSurvivalResult, setUserSurvivalResult] = useState<
    UserSurvivalResult[]
  >([])

  useEffect(() => {
    const survivalResults = Object.values(GAME_MAP).reduce((acc, gameMap) => {
      if (gameMap === GAME_MAP.TUTORIAL) {
        return acc
      }

      const userCampaignResult = app.gameProgress[GAME_MODE.CAMPAIGN]?.[
        gameMap
      ]?.results.find((res) => res.username === app.username)

      const userSurvivalResult = app.gameProgress[GAME_MODE.SURVIVAL]?.[
        gameMap
      ]?.results.find((res) => res.username === app.username)

      acc.push({
        gameMap: gameMap as REGULAR_GAME_MAP,
        bestTime: userSurvivalResult?.bestTime ?? null,
        completed: userCampaignResult?.completed ?? false,
      })
      return acc
    }, [] as UserSurvivalResult[])

    setUserSurvivalResult(survivalResults)
    let selected: REGULAR_GAME_MAP | null = null
    for (const result of survivalResults) {
      if (result.completed) {
        selected = result.gameMap
      }
      break
    }
    if (selected) {
      setSelectedMap(selected)
    }
  }, [app.gameProgress, app.username])

  return (
    <div className="menu-campaign-survival-mode">
      <MenuModeCommonHeader
        title={t('menu:gameMode.survival.title')}
        onModeChange={onModeChange}
      />
      <div style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>
        {t('menu:gameMode.survival.description')}
      </div>
      <div className="maps-list">
        {userSurvivalResult.map((userResult) => (
          <MapTile
            key={userResult.gameMap}
            gameMap={userResult.gameMap}
            locked={!userResult.completed}
            selected={selectedMap === userResult.gameMap}
            onSelect={() => setSelectedMap(userResult.gameMap)}
            bestScore={userResult.bestTime ?? undefined}
          />
        ))}
      </div>
      {selectedMap && (
        <div>
          <span>{t('menu:selectedMap')}</span>:&nbsp;
          <strong>{t(gameMapsInfo[selectedMap].name)}</strong>
        </div>
      )}
      <button
        style={{ fontSize: 22 }}
        disabled={!selectedMap}
        onClick={
          selectedMap
            ? () => onStartGame?.(GAME_MODE.SURVIVAL, selectedMap)
            : undefined
        }
      >
        <Icon path={mdiPlay} size="16px" style={{ marginRight: 4 }} />
        {t('common:start')}
      </button>
    </div>
  )
}
