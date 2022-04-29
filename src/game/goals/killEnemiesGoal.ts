import { GameEngine } from '../engine/gameEngine'
import { GUIController } from '../gui'
import { GameGoal } from './gameGoal'

export class KillEnemiesGoal extends GameGoal {
  private enemiesToKill: number

  private readonly events = {
    onEnemyKilled: this.handleEnemyKilled.bind(this),
  }

  constructor(engine: GameEngine, gui: GUIController, enemiesToKill: number) {
    super(engine, gui)

    this.gui.setEnemiesToKill((this.enemiesToKill = enemiesToKill))

    this.engine.events.on('enemy-killed', this.events.onEnemyKilled)
  }

  destroy() {
    this.engine.events.off('enemy-killed', this.events.onEnemyKilled)
  }

  private handleEnemyKilled() {
    if (this.reached) {
      return
    }
    this.gui.setEnemiesToKill(--this.enemiesToKill)
    if (this.enemiesToKill <= 0) {
      this.reached = true
    }
  }

  update() {
    // noop
  }
}
