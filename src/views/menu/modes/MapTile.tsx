import React, { useMemo } from 'react'
import { mdiLock } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { GAME_MAP, gameMapsInfo } from '../../../utils'

import './MapTile.scss'

interface MapTileProps {
  gameMap: GAME_MAP
  locked?: boolean
  selected?: boolean
  onSelect?: () => void
  bestScore?: number
  width?: number
}

export const MapTile = ({
  gameMap,
  locked,
  selected,
  onSelect,
  bestScore,
  width,
}: MapTileProps) => {
  const [t] = useTranslation()

  const style = useMemo<React.CSSProperties>(() => {
    return width ? { width, height: Math.round(width * 0.618) } : {}
  }, [width])

  return locked ? (
    <div className="map-tile locked" style={style}>
      <Icon path={mdiLock} size="96px" />
    </div>
  ) : (
    <div
      className={clsx(
        'map-tile',
        selected && 'selected',
        onSelect && 'selectable',
      )}
      onClick={onSelect}
      style={style}
    >
      <img src={gameMapsInfo[gameMap].preview} />
      <header>{t(gameMapsInfo[gameMap].name)}</header>
      {typeof bestScore === 'number' && (
        <div className="best-score">
          <span>{t('menu:bestScore')}:</span>
          <strong>{bestScore}</strong>
        </div>
      )}
    </div>
  )
}
