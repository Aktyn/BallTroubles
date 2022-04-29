import EventEmitter from 'events'
import { GUIController } from '../gui'
import { PhysicsWorld } from '../physics/world'
import { objectsAreInstancesOf } from './common/helpers'
import { Steering } from './common/steering'
import { ExplosionEmitter } from './emitters/explosionEmitter'
import { GameMap } from './gameMap'
import { BulletBase } from './objects/bullets/bulletBase'
import { DynamicObject } from './objects/dynamicObject'
import { EffectBase } from './objects/effects/effectBase'
import { EnemyBase } from './objects/enemyBase'
import { ObjectBase } from './objects/objectBase'
import { Player } from './objects/player'
import { Portal } from './objects/portal'

declare interface GameEngineEventEmitter {
  on(event: 'enemy-damaged', listener: (damage: number) => void): this
  on(event: 'enemy-killed', listener: () => void): this

  emit(event: 'enemy-damaged', damage: number): boolean
  emit(event: 'enemy-killed'): boolean
}

class GameEngineEventEmitter extends EventEmitter {}

export class GameEngine extends PhysicsWorld {
  private readonly gui: GUIController
  readonly events = new GameEngineEventEmitter()
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

    this.map.add(player)
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

    // Player hits enemy
    objectsAreInstancesOf(
      objectA,
      objectB,
      Player,
      EnemyBase,
      (player, enemy) => player.inflictDamage(enemy.strength),
    )

    // Object hits effect
    objectsAreInstancesOf(
      objectA,
      objectB,
      DynamicObject,
      EffectBase,
      (object, effect) => effect.applyEffect(object),
    )

    // Bullet hit
    objectsAreInstancesOf(
      objectA,
      objectB,
      BulletBase,
      DynamicObject,
      (bullet, object) => {
        if (
          object.dynamicObjectProperties.isSensor ||
          object instanceof Portal
        ) {
          return
        }
        if (object instanceof EnemyBase) {
          this.events.emit('enemy-damaged', bullet.strength)
          if (object.inflictDamage(bullet.strength)) {
            //TODO: add some score to player and acknowledge enemy killed
            this.map.add(new ExplosionEmitter(object.position))
            this.events.emit('enemy-killed')
          }
        }

        bullet.shouldBeDeleted = true //TODO: bouncing bullets will not be destroyed on collision
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
