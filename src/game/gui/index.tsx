import EventEmitter from 'events'
import {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useContext,
  useCallback,
} from 'react'
import {
  mdiCog,
  mdiDevTo,
  mdiExitToApp,
  mdiMinus,
  mdiPause,
  mdiPauseCircleOutline,
  mdiPlay,
  mdiPlus,
} from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { Dialog } from '../../components/Dialog'
import { IconButton } from '../../components/IconButton'
import { Loader } from '../../components/Loader'
import { AppContext } from '../../context/appContext'
import palette from '../../style/palette.json'
import {
  clamp,
  gameMapsInfo,
  gameModesInfo,
  GAME_MAP,
  GAME_MODE,
  HexColor,
  parseTime,
} from '../../utils'
import { EffectBase } from '../engine/objects/effects/effectBase'
import { Resources } from '../resources'
import { Bar } from './Bar'
import { GameResult, GameResultDialog } from './GameResultDialog'

import './gui.scss'

const barSaturation = 300
const DAMAGE_EFFECT_DURATION = 1000

declare interface GUIEventEmitter {
  on(event: 'zoom-reset', listener: () => void): this
  on(event: 'zoom-in', listener: () => void): this
  on(event: 'zoom-out', listener: () => void): this

  on(event: 'toggle-game-pause', listener: () => void): this
  on(event: 'exit-game', listener: () => void): this
  on(event: 'repeat-game', listener: () => void): this

  emit(event: 'zoom-reset'): boolean
  emit(event: 'zoom-in'): boolean
  emit(event: 'zoom-out'): boolean

  emit(event: 'toggle-game-pause'): boolean
  emit(event: 'exit-game'): boolean
  emit(event: 'repeat-game'): boolean
}

class GUIEventEmitter extends EventEmitter {}

export interface GUIController {
  setFPS: React.Dispatch<React.SetStateAction<number>>
  setZoom: React.Dispatch<React.SetStateAction<number>>
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>
  setGameScore: React.Dispatch<React.SetStateAction<number>>
  setPlayerHP: (hp: number, takenDamage?: number) => void
  setPlayerSpeed: React.Dispatch<React.SetStateAction<number>>
  setPlayerEffects: React.Dispatch<
    React.SetStateAction<{ effect: EffectBase; duration: number }[]>
  >
  setGameMode: React.Dispatch<React.SetStateAction<GAME_MODE | null>>
  setGameMap: React.Dispatch<React.SetStateAction<GAME_MAP | null>>
  setLoadingResources: (loading: boolean) => void
  showResults: (
    elapsedTime: number,
    score: number | null,
    isPlayerDead: boolean,
  ) => void
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
  setEnemiesToKill: React.Dispatch<React.SetStateAction<number | null>>

  events: GUIEventEmitter
}

export const GUI = forwardRef<GUIController>(function GUI(_, ref) {
  const [t] = useTranslation()
  const app = useContext(AppContext)

  const emitterRef = useRef<GUIEventEmitter>(new GUIEventEmitter())

  const [exitGameDialogOpen, setExitGameDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)

  const [loadingResources, setLoadingResources] = useState(Resources.loading)
  const [fps, setFPS] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [gameScore, setGameScore] = useState<number>(0)
  const [playerHP, setPlayerHP] = useState<number>(0.5)
  const [playerSpeed, setPlayerSpeed] = useState<number>(0.5)
  const [playerEffects, setPlayerEffects] = useState<
    { effect: EffectBase; duration: number }[]
  >([])
  const [gameMode, setGameMode] = useState<GAME_MODE | null>(null)
  const [gameMap, setGameMap] = useState<GAME_MAP | null>(null)
  const [paused, setPaused] = useState(false)

  // Goals
  const [enemiesToKill, setEnemiesToKill] = useState<number | null>(null)

  const [damageEffects, setDamageEffects] = useState<
    { id: string; value: number }[]
  >([])

  const handleSetPlayerHP = useCallback((hp: number, takenDamage?: number) => {
    setPlayerHP(hp)
    if (takenDamage) {
      const id = uuid()
      setDamageEffects((d) => [...d, { id, value: takenDamage }])

      const tm = setTimeout(() => {
        setDamageEffects((d) => d.filter((e) => e.id !== id))
      }, DAMAGE_EFFECT_DURATION)
      return () => {
        clearTimeout(tm)
      }
    }
  }, [])

  const handleShowGameResults = useCallback(
    (elapsedTime: number, score: number | null, isPlayerDead: boolean) => {
      setExitGameDialogOpen(false)
      setSettingsDialogOpen(false)
      setGameResult({
        user: app.username,
        elapsedTime,
        score,
        playerDied: isPlayerDead,
      })
    },
    [app.username],
  )

  useImperativeHandle(
    ref,
    () => ({
      setLoadingResources,
      showResults: handleShowGameResults,
      setFPS,
      setZoom,
      setGameScore,
      setElapsedTime,
      setPlayerHP: handleSetPlayerHP,
      setPlayerSpeed,
      setPlayerEffects,
      setGameMode,
      setGameMap,
      setPaused,
      setEnemiesToKill,
      events: emitterRef.current,
    }),
    [handleSetPlayerHP, handleShowGameResults],
  )

  return (
    <>
      <div className="gui-main">
        <div className="left-panel" onWheel={(e) => e.stopPropagation()}>
          {loadingResources ? (
            <div className="loading-info">
              <div>{t('game:loadingResourcesInfo')}</div>
              <div style={{ marginTop: 8 }}>
                <Loader />
              </div>
            </div>
          ) : (
            <>
              <div className="stats-info">
                <label>{t('game:mode')}:</label>
                <span>{gameMode ? t(gameModesInfo[gameMode].name) : '-'}</span>
                <label>{t('game:map')}:</label>
                <span>{gameMap ? t(gameMapsInfo[gameMap].name) : '-'}</span>
                <label>{t('game:elapsedTime')}:</label>
                {gameMode === GAME_MODE.CAMPAIGN && (
                  <>
                    <label>{t('game:score')}:</label>
                    <span>{Math.round(gameScore)}</span>
                  </>
                )}
                <span>{parseTime(elapsedTime)}</span>
                {enemiesToKill !== null && (
                  <>
                    <label className="stats-category-separator">
                      {t('game:goal.label')}
                    </label>
                    <span className="dummy" />
                  </>
                )}
                {enemiesToKill !== null && (
                  <>
                    <label>{t('game:goal.enemiesLeftToKill')}:</label>
                    <span>{enemiesToKill}</span>
                  </>
                )}
              </div>
              <div>
                <div className="player-property-info">
                  <label>{t('game:player.health')}</label>
                  <Bar
                    value={playerHP}
                    colors={[
                      palette.red[barSaturation] as HexColor,
                      palette['deep-orange'][barSaturation] as HexColor,
                      palette.orange[barSaturation] as HexColor,
                      palette.amber[barSaturation] as HexColor,
                      palette.yellow[barSaturation] as HexColor,
                      palette.lime[barSaturation] as HexColor,
                      palette['light-green'][barSaturation] as HexColor,
                      palette.green[barSaturation] as HexColor,
                    ]}
                  />
                </div>
                <div className="player-property-info">
                  <label>{t('game:player.speed')}</label>
                  <Bar
                    value={playerSpeed}
                    colors={[
                      palette.cyan[barSaturation] as HexColor,
                      palette.blue[barSaturation] as HexColor,
                      palette['deep-orange'][barSaturation] as HexColor,
                      palette.red[barSaturation] as HexColor,
                    ]}
                  />
                </div>
                <div className="player-property-info">
                  <label>{t('game:player.activeEffects')}</label>
                  <div className="active-effects">
                    {playerEffects.length ? (
                      playerEffects.map(({ effect, duration }) =>
                        effect.icon ? (
                          <span key={effect.id}>
                            <img src={effect.icon} />
                            <svg viewBox="0 0 24 24">
                              <circle
                                cx="12"
                                cy="12"
                                r="11"
                                style={{
                                  animationDuration: `${duration}ms`,
                                  animationPlayState: paused
                                    ? 'paused'
                                    : 'running',
                                }}
                              />
                            </svg>
                          </span>
                        ) : null,
                      )
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="stats-info">
                  <label>{t('menu:username')}:</label>
                  <span>{app.username}</span>
                  <label>{t('game:fps')}:</label>
                  <span>{Math.round(fps)}</span>
                  <label>{t('game:zoom')}:</label>
                  <div>{Number(zoom).toFixed(2)}</div>
                  <div
                    className="flex gap-8"
                    style={{
                      gridColumn: '1 / span 2',
                      justifySelf: 'center',
                    }}
                  >
                    <IconButton
                      path={mdiMinus}
                      title="Zoom out"
                      size="20px"
                      onClick={(e) => {
                        emitterRef.current.emit('zoom-in')
                        ;(e.target as HTMLButtonElement).blur()
                      }}
                      disabled={paused}
                    />
                    <button
                      onClick={(e) => {
                        emitterRef.current.emit('zoom-reset')
                        ;(e.target as HTMLButtonElement).blur()
                      }}
                      disabled={paused || zoom === 1}
                    >
                      {t('game:resetZoom')}
                    </button>
                    <IconButton
                      path={mdiPlus}
                      title="Zoom out"
                      size="20px"
                      onClick={(e) => {
                        emitterRef.current.emit('zoom-out')
                        ;(e.target as HTMLButtonElement).blur()
                      }}
                      disabled={paused}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Icon path={mdiDevTo} title="Dev" size="48px" />
                </div>
                <div className="footer-info">
                  <div>
                    <strong>{t('global:appName')}</strong>&nbsp;|&nbsp;
                    {t('common:version')}&nbsp;
                    <strong>{process.env.REACT_APP_VERSION}</strong>
                  </div>
                  <div>{t('global:createdBy')}</div>
                </div>
                <div className="bottom-options">
                  <button
                    onClick={(e) => {
                      emitterRef.current.emit('toggle-game-pause')
                      ;(e.target as HTMLButtonElement).blur()
                    }}
                  >
                    <Icon
                      path={paused ? mdiPlay : mdiPause}
                      size="16px"
                      style={{ marginRight: 4 }}
                    />
                    {t(paused ? 'game:resume' : 'game:pause')}
                  </button>
                  <button
                    onClick={(e) => {
                      setSettingsDialogOpen(true)
                      ;(e.target as HTMLButtonElement).blur()
                    }}
                  >
                    <Icon
                      path={mdiCog}
                      size="16px"
                      style={{ marginRight: 4 }}
                    />
                    {t('game:settings')}
                  </button>
                  <button
                    onClick={(e) => {
                      setExitGameDialogOpen(true)
                      ;(e.target as HTMLButtonElement).blur()
                    }}
                  >
                    <Icon
                      path={mdiExitToApp}
                      size="16px"
                      style={{ marginRight: 4 }}
                    />
                    {t('game:exitGame')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {damageEffects.map(({ id, value }) => (
          <div
            key={id}
            className="damage-overlay gui-overlay"
            style={{
              opacity: clamp(Math.pow(value, 0.5), 0.1, 1),
              animationDuration: `${DAMAGE_EFFECT_DURATION}ms`,
            }}
          />
        ))}
        {paused && (
          <div className="paused-overlay gui-overlay">
            <Icon path={mdiPauseCircleOutline} />
          </div>
        )}
      </div>
      <Dialog
        open={exitGameDialogOpen}
        onClose={() => setExitGameDialogOpen(false)}
        onConfirm={() => {
          emitterRef.current.emit('exit-game')
          toast(t('game:toastr.exitGameInfo'), { type: 'info' })
        }}
        title={t('game:exitGameDialog.title')}
      >
        <div style={{ whiteSpace: 'pre-line' }}>
          {t('game:exitGameDialog.text')}
        </div>
      </Dialog>
      <Dialog
        open={settingsDialogOpen}
        onConfirm={() => setSettingsDialogOpen(false)}
        title={t('game:settingsDialog.title')}
      >
        <div style={{ whiteSpace: 'pre-line' }}>{/*TODO*/}</div>
      </Dialog>
      {gameMode !== null && gameMap !== null && (
        <GameResultDialog
          result={gameResult}
          mode={gameMode}
          map={gameMap}
          onExitToMenu={() => {
            setGameResult(null)
            emitterRef.current.emit('exit-game')
          }}
          onRepeatGame={() => {
            setGameResult(null)
            emitterRef.current.emit('repeat-game')
          }}
        />
      )}
    </>
  )
})
