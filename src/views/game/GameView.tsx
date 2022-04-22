import { useRef, useCallback, useEffect } from 'react'
import { GameCore } from '../../game/gameCore'
import { ThreeJSRenderer } from '../../game/graphics/threeJSRenderer'
import { GUIController, GUI } from '../../game/gui'
import { Resources } from '../../game/resources'
import { GAME_MODE, GAME_MAP } from '../../utils'

import './GameView.scss'

export const GameView = ({ mode, map }: { mode: GAME_MODE; map: GAME_MAP }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const guiRef = useRef<GUIController | null>(null)

  const startGame = useCallback(() => {
    if (!canvasRef.current) {
      throw new Error('No canvas found')
    }
    if (!guiRef.current) {
      throw new Error('No gui found')
    }

    try {
      const renderer = new ThreeJSRenderer(canvasRef.current)
      const gameCore = new GameCore(renderer, guiRef.current)
      gameCore.startGame(mode, map)

      return () => {
        gameCore.destroy()
      }
    } catch (e) {
      console.error(e)
    }
  }, [map, mode])

  useEffect(() => {
    Resources.onLoadingFinished(startGame)
  }, [startGame])

  return (
    <div className="game-layout">
      <canvas ref={canvasRef} />
      <GUI ref={guiRef} />
    </div>
  )
}
