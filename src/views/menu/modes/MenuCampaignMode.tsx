import { useState } from 'react'
import { mdiChevronLeft, mdiLock, mdiPlay } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { GAME_MODE, GAME_MAP } from '../../../utils'
import { CommonMenuModeProperties, gameMapsInfo, MENU_MODE } from './common'

import './MenuCampaignMode.scss'

// TODO: move this to AppContext and synchronize with local storage
const savedMapResults = {
  [GAME_MAP.MAP1]: {
    locked: false,
    bestResult: 1337,
  },
  [GAME_MAP.MAP2]: {
    locked: false,
    bestResult: null,
  },
  [GAME_MAP.MAP3]: {
    locked: true,
    bestResult: null,
  },
}

export const MenuCampaignMode = ({
  onModeChange,
  onStartGame,
}: CommonMenuModeProperties) => {
  const [t] = useTranslation()

  const defaultSelected = Object.entries(savedMapResults)
    .reverse()
    .find(([, { locked }]) => !locked)?.[0] as GAME_MAP

  const [selectedMap, setSelectedMap] = useState<GAME_MAP>(
    defaultSelected ?? GAME_MAP.MAP1,
  )

  //TODO: some info above maps list about unlocking maps one by one and info when all maps are unlocked and entire campaign completed

  return (
    <div className="menu-campaign-mode">
      <header>
        <span />
        <span>{t('menu:gameMode.campaign.title')}</span>
        <button onClick={() => onModeChange(MENU_MODE.HOME)}>
          <Icon path={mdiChevronLeft} size="16px" style={{ marginRight: 4 }} />
          {t('common:return')}
        </button>
      </header>
      <div className="maps-list">
        {Object.entries(gameMapsInfo).map(([mapId, mapInfo]) =>
          savedMapResults[mapId as unknown as GAME_MAP]?.locked ? (
            <div key={mapId} className="locked">
              <Icon path={mdiLock} size="96px" />
            </div>
          ) : (
            <div
              key={mapId}
              className={clsx(selectedMap === mapId && 'selected')}
              onClick={() => setSelectedMap(mapId as GAME_MAP)}
            >
              <img src={mapInfo.preview} />
              <header>{t(mapInfo.name)}</header>
              {!!savedMapResults[mapId as GAME_MAP]?.bestResult && (
                <div className="best-score">
                  <span>{t('menu:bestResult')}:</span>
                  <strong>
                    {savedMapResults[mapId as GAME_MAP]?.bestResult}
                  </strong>
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <button
        style={{ fontSize: 22 }}
        onClick={() => onStartGame?.(GAME_MODE.CAMPAIGN, selectedMap)}
      >
        <Icon path={mdiPlay} size="16px" style={{ marginRight: 4 }} />
        {t('common:start')}
      </button>
    </div>
  )
}
