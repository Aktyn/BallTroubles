import { GameEngine } from '../engine/index'
import { Renderer } from '../graphics/renderer'

export type MapGenerator = (engine: GameEngine, renderer: Renderer) => void
