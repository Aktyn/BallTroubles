import { useRef, useEffect, useCallback } from 'react'

import { GameCore } from './game/gameCore'
import { ThreeJSRenderer } from './game/graphics/threeJSRenderer'
import { GUI, GUIController } from './game/gui'
import { Resources } from './game/resources'

import './App.scss'

function App() {
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
      gameCore.startGame()

      return () => {
        gameCore.destroy()
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

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

export default App
