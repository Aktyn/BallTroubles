import { GameEngine } from '../engine/gameEngine'
import { GUIController } from '../gui'

export abstract class GameGoal {
  protected readonly engine: GameEngine
  protected readonly gui: GUIController

  protected reached = false

  constructor(engine: GameEngine, gui: GUIController) {
    this.engine = engine
    this.gui = gui
  }

  isReached() {
    return this.reached
  }

  reset() {
    this.reached = false
  }

  abstract destroy(): void
  abstract update(deltaTime: number): void
}
