import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { Dialog } from '../../../components/Dialog'
import { AppContext } from '../../../context/appContext'
import { GAME_MAP, GAME_MODE, parseTime } from '../../../utils'
import { MapTile } from './MapTile'
import { MenuModeCommonHeader } from './MenuModeCommonHeader'
import { CommonMenuModeProperties } from './common'

import './MenuHighscoresMode.scss'

type REGULAR_GAME_MAP = Exclude<GAME_MAP, 'tutorial'>

export const MenuHighscoresMode = ({
  onModeChange,
}: CommonMenuModeProperties) => {
  const [t] = useTranslation()
  const app = useContext(AppContext)

  const [resetProgressDialogOpen, setResetProgressDialogOpen] = useState(false)

  interface CampaignHighscore {
    id: string
    username: string
    bestScore: number
  }
  interface SurvivalHighscore {
    id: string
    username: string
    bestTime: number
  }

  const [unlockedMaps, setUnlockedMaps] = useState<REGULAR_GAME_MAP[]>([])
  const [campaignHighscores, setCampaignHighscores] = useState<
    Map<REGULAR_GAME_MAP, CampaignHighscore[]>
  >(new Map())
  const [survivalHighscores, setSurvivalHighscores] = useState<
    Map<REGULAR_GAME_MAP, SurvivalHighscore[]>
  >(new Map())

  useEffect(() => {
    const unlockedMaps: REGULAR_GAME_MAP[] = []

    let unlocked: REGULAR_GAME_MAP = GAME_MAP.MAP1
    for (const map of Object.values(GAME_MAP)) {
      if (
        app.gameProgress[GAME_MODE.CAMPAIGN]?.[
          map as REGULAR_GAME_MAP
        ]?.results.some((res) => res.username === app.username && res.completed)
      ) {
        unlockedMaps.push(unlocked)
        unlocked = map as REGULAR_GAME_MAP
      } else {
        break
      }
    }
    unlockedMaps.push(unlocked)

    const campaign = new Map<REGULAR_GAME_MAP, CampaignHighscore[]>()
    const survival = new Map<REGULAR_GAME_MAP, SurvivalHighscore[]>()

    for (const map of Object.values(GAME_MAP)) {
      if (map in (app.gameProgress[GAME_MODE.CAMPAIGN] ?? {})) {
        const campaignBest = (
          app.gameProgress[GAME_MODE.CAMPAIGN][map as REGULAR_GAME_MAP]
            ?.results ?? []
        )
          .reduce((acc, res) => {
            if ((res.bestScore ?? 0) > 0) {
              acc.push({
                id: uuid(),
                username: res.username,
                bestScore: res.bestScore,
              })
            }
            return acc
          }, [] as CampaignHighscore[])
          .sort((a, b) => b.bestScore - a.bestScore)
        campaign.set(map as REGULAR_GAME_MAP, campaignBest)

        const survivalBest = (
          app.gameProgress[GAME_MODE.SURVIVAL][map as REGULAR_GAME_MAP]
            ?.results ?? []
        )
          .reduce((acc, res) => {
            if ((res.bestTime ?? 0) > 0) {
              acc.push({
                id: uuid(),
                username: res.username,
                bestTime: res.bestTime,
              })
            }
            return acc
          }, [] as SurvivalHighscore[])
          .sort((a, b) => a.bestTime - b.bestTime)
        survival.set(map as REGULAR_GAME_MAP, survivalBest)
      }
    }

    setCampaignHighscores(campaign)
    setSurvivalHighscores(survival)

    setUnlockedMaps(unlockedMaps)
  }, [app.gameProgress, app.username])

  return (
    <>
      <div className="menu-highscores-mode">
        <MenuModeCommonHeader
          title={t('menu:highscores.title')}
          onModeChange={onModeChange}
        />
        <div className="maps-list">
          {Object.values(GAME_MAP).map((gameMap) =>
            gameMap === GAME_MAP.TUTORIAL ? null : (
              <div key={gameMap}>
                <MapTile
                  gameMap={gameMap}
                  locked={!unlockedMaps.includes(gameMap)}
                  width={448}
                />
                <div className="modes">
                  <div>
                    <header>{t('menu:gameMode.campaign.title')}</header>
                    <div>
                      <strong>{t('menu:username')}</strong>
                      <strong>{t('menu:score')}</strong>
                      {!campaignHighscores.get(gameMap)?.length ? (
                        <div className="no-results">
                          {t('menu:highscores.noSavedResults')}
                        </div>
                      ) : (
                        campaignHighscores.get(gameMap)?.map((best) => (
                          <React.Fragment key={best.id}>
                            <span
                              className={clsx(
                                best.username === app.username &&
                                  'current-user',
                              )}
                            >
                              {best.username}
                            </span>
                            <span>{best.bestScore}</span>
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <header>{t('menu:gameMode.survival.title')}</header>
                    <div>
                      <strong>{t('menu:username')}</strong>
                      <strong>{t('menu:time')}</strong>
                      {!survivalHighscores.get(gameMap)?.length ? (
                        <div className="no-results">
                          {t('menu:highscores.noSavedResults')}
                        </div>
                      ) : (
                        survivalHighscores.get(gameMap)?.map((best) => (
                          <React.Fragment key={best.id}>
                            <span
                              className={clsx(
                                best.username === app.username &&
                                  'current-user',
                              )}
                            >
                              {best.username}
                            </span>
                            <span>{parseTime(best.bestTime)}</span>
                          </React.Fragment>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <button onClick={() => setResetProgressDialogOpen(true)}>
          {t('menu:resetProgress')}
        </button>
      </div>
      <Dialog
        open={resetProgressDialogOpen}
        onClose={() => setResetProgressDialogOpen(false)}
        onConfirm={() => {
          app.setGameProgress({
            [GAME_MODE.TUTORIAL]: { completedBy: [] },
            [GAME_MODE.CAMPAIGN]: {},
            [GAME_MODE.SURVIVAL]: {},
          })
          setResetProgressDialogOpen(false)
          toast(t('menu:toastr.progressResetInfo'), { type: 'info' })
        }}
        title={t('menu:resetProgressDialog.title')}
      >
        <div style={{ whiteSpace: 'pre-line' }}>
          {t('menu:resetProgressDialog.text')}
        </div>
      </Dialog>
    </>
  )
}
