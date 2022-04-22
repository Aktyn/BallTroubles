import { GameEngine } from '../engine/gameEngine'
import { Renderer } from '../graphics/renderer'

export type MapGenerator = (engine: GameEngine, renderer: Renderer) => void
