import { useRef, useEffect, useContext } from 'react'
import { AppContext } from '../../context/appContext'
import { CampaignGameMode } from '../../game/campaignGameMode'
import { GameCore } from '../../game/gameCore'
import { ThreeJSRenderer } from '../../game/graphics/threeJSRenderer'
import { GUIController, GUI } from '../../game/gui'
import { SurvivalGameMode } from '../../game/survivalGameMode'
import { TutorialGameMode } from '../../game/tutorialGameMode'
import { GAME_MODE, GAME_MAP } from '../../utils'

import './GameView.scss'

interface GameViewProps {
  mode: GAME_MODE
  map: GAME_MAP
  onExit: () => void
}

export const GameView = ({ mode, map, onExit }: GameViewProps) => {
  const app = useContext(AppContext)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const guiRef = useRef<GUIController | null>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error('No canvas found')
    }
    const gui = guiRef.current
    if (!gui) {
      throw new Error('No gui found')
    }

    gui.events.on('exit-game', onExit)

    try {
      const renderer = new ThreeJSRenderer(canvasRef.current)
      const gameCore: GameCore | null =
        mode === GAME_MODE.TUTORIAL
          ? new TutorialGameMode(app, renderer, gui)
          : mode === GAME_MODE.CAMPAIGN
          ? new CampaignGameMode(app, renderer, gui)
          : mode === GAME_MODE.SURVIVAL
          ? new SurvivalGameMode(app, renderer, gui)
          : null

      if (!gameCore) {
        throw new Error('Incorrect game mode')
      }

      gui.setGameMode(mode)
      gui.setGameMap(map)
      gameCore.startGame(map)

      const onRepeat = () => {
        gameCore.restartGame(map)
      }

      gui.events.on('repeat-game', onRepeat)

      return () => {
        gameCore.destroy()
        gui.events.off('exit-game', onExit)
        gui.events.off('repeat-game', onRepeat)
      }
    } catch (e) {
      console.error(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="game-layout">
      <canvas ref={canvasRef} />
      <GUI ref={guiRef} />
    </div>
  )
}
