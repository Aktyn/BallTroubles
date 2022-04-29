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

export const MenuCampaignMode = ({
  onModeChange,
  onStartGame,
}: CommonMenuModeProperties) => {
  const [t] = useTranslation()

  const app = useContext(AppContext)

  interface UserCampaignResult {
    gameMap: REGULAR_GAME_MAP
    bestScore: number | null
    completed: boolean
  }

  const [selectedMap, setSelectedMap] = useState<REGULAR_GAME_MAP>(
    GAME_MAP.MAP1,
  )
  const [nextMapToComplete, setNextMapToComplete] = useState<REGULAR_GAME_MAP>(
    GAME_MAP.MAP1,
  )
  const [userCampaignResult, setUserCampaignResult] = useState<
    UserCampaignResult[]
  >([])

  useEffect(() => {
    const campaignResults = Object.values(GAME_MAP).reduce((acc, gameMap) => {
      if (gameMap === GAME_MAP.TUTORIAL) {
        return acc
      }

      const userResult = app.gameProgress[GAME_MODE.CAMPAIGN]?.[
        gameMap
      ]?.results.find((res) => res.username === app.username)

      acc.push({
        gameMap,
        bestScore: userResult?.bestScore ?? null,
        completed: userResult?.completed ?? false,
      })
      return acc
    }, [] as UserCampaignResult[])

    setUserCampaignResult(campaignResults)
    let prev: GAME_MAP | null = null
    for (const result of campaignResults) {
      if (!result.completed) {
        if (prev) {
          setSelectedMap(result.gameMap)
          setNextMapToComplete(result.gameMap)
        }
        break
      }
      prev = result.gameMap
    }
  }, [app.gameProgress, app.username])

  return (
    <div className="menu-campaign-survival-mode">
      <MenuModeCommonHeader
        title={t('menu:gameMode.campaign.title')}
        onModeChange={onModeChange}
      />
      <div>{t('menu:gameMode.campaign.description')}</div>
      <div className="maps-list">
        {userCampaignResult.map((userResult) => (
          <MapTile
            key={userResult.gameMap}
            gameMap={userResult.gameMap}
            locked={
              !userResult.completed && userResult.gameMap !== nextMapToComplete
            }
            selected={selectedMap === userResult.gameMap}
            onSelect={() => setSelectedMap(userResult.gameMap)}
            bestScore={userResult.bestScore ?? undefined}
          />
        ))}
      </div>
      <div>
        <span>{t('menu:selectedMap')}</span>:&nbsp;
        <strong>{t(gameMapsInfo[selectedMap].name)}</strong>
      </div>
      <button
        style={{ fontSize: 22 }}
        onClick={() => onStartGame?.(GAME_MODE.CAMPAIGN, selectedMap)}
      >
        <Icon path={mdiPlay} size="24px" style={{ marginRight: 4 }} />
        {t('common:start')}
      </button>
    </div>
  )
}
