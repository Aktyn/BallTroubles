import { GUIController } from '../gui'
import { PhysicsWorld } from '../physics/world'
import { objectsAreInstancesOf } from './common/helpers'
import { Steering } from './common/steering'
import { GameMap } from './gameMap'
import { DynamicObject } from './objects/dynamicObject'
import { EffectBase } from './objects/effects/effectBase'
import { EnemyBase } from './objects/enemyBase'
import { ObjectBase } from './objects/objectBase'
import { Player } from './objects/player'
import { Portal } from './objects/portal'

export class GameEngine extends PhysicsWorld {
  private readonly gui: GUIController
  readonly map: GameMap

  constructor(gui: GUIController) {
    super()
    this.gui = gui
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

  spawnPlayer(steering: Steering, onDeath: () => void, isCameraTarget = false) {
    const player = new Player(steering, this.world, this.gui, onDeath)

    this.map.addObject(player)
    if (isCameraTarget) {
      this.map.setCameraTarget(player)
    }
    return player
  }

  onCollisionStart(objectA: ObjectBase, objectB: ObjectBase) {
    // Dynamic object enters portal
    objectsAreInstancesOf(
      objectA,
      objectB,
      DynamicObject,
      Portal,
      (object, portal) => {
        const exitPortal = this.map.updatables.find(
          (obj) =>
            obj instanceof Portal &&
            obj !== portal &&
            obj.groupNumber === portal.groupNumber,
        )
        if (!exitPortal) {
          console.warn(
            `No exit portal found. Group number: ${portal.groupNumber}`,
          )
          return
        }
        portal.teleport(object, exitPortal as Portal)
      },
    )
    objectsAreInstancesOf(
      objectA,
      objectB,
      Player,
      EnemyBase,
      (player, enemy) => {
        player.inflictDamage(enemy.strength)
      },
    )
    objectsAreInstancesOf(
      objectA,
      objectB,
      DynamicObject,
      EffectBase,
      (object, effect) => {
        effect.applyEffect(object)
      },
    )
  }

  onCollisionEnd(objectA: ObjectBase, objectB: ObjectBase) {
    // Dynamic object exits portal
    objectsAreInstancesOf(
      objectA,
      objectB,
      DynamicObject,
      Portal,
      (object, portal) => portal.objectLeftTeleport(object),
    )
  }
}
