import { GUIController } from '../gui'
import { PhysicsWorld } from '../physics/world'
import { Steering } from './common/steering'
import { GameMap } from './gameMap'
import { Player } from './objects/player'

export class GameEngine extends PhysicsWorld {
  readonly map: GameMap

  constructor(gui: GUIController) {
    super()
    this.map = new GameMap(gui)
  }

  destroy() {
    this.map.destroy()
    super.destroy()
  }

  getMap(): Readonly<GameMap> {
    return this.map
  }

  update(deltaTime: number) {
    super.update(deltaTime)
    this.map.update(deltaTime)
  }

  spawnPlayer(steering: Steering, isCameraTarget = false) {
    const player = new Player(steering, this.world)

    this.map.addObject(player)
    this.map.addEmitter(player.emitter)
    if (isCameraTarget) {
      this.map.setCameraTarget(player)
    }
    return player
  }
}
