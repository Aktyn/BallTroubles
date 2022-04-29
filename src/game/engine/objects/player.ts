import Box2D from '@cocos/box2d'
import { clamp, Vector2, Vector3 } from '../../../utils'
import { GUIController } from '../../gui'
import { PhysicsParameters } from '../../physics/utils'
import { Steering } from '../common/steering'
import { FireballEmitter } from '../emitters/fireballEmitter'
import { COLLISION_MASKS, OBJECT_MATERIAL, OBJECT_TYPE } from './common'
import { DynamicObject } from './dynamicObject'
import { EffectBase } from './effects/effectBase'

interface PlayerProperties {
  maxSpeed?: number
  minSpeed?: number
  rotationSpeed?: number
}

export class Player extends DynamicObject {
  private static SPEED_SMOOTHNESS = 2
  private static ANGLE_SMOOTHNESS = 4
  private static ACCELERATION = 0.5

  private readonly steering: Steering
  private readonly gui: GUIController
  private readonly playerProperties: Required<PlayerProperties>
  private readonly effects = new Map<
    string,
    { effect: EffectBase; duration: number }
  >()
  private readonly onDeath: () => void

  private speed = 0
  private hp = 1

  constructor(
    steering: Steering,
    world: Box2D.World,
    gui: GUIController,
    onDeath: () => void,
    properties: PlayerProperties = {},
  ) {
    super(new Vector3(), world, {
      type: OBJECT_TYPE.SMALL_BALL,
      material: OBJECT_MATERIAL.PLAYER,
      friction: 0.5,
      restitution: 1,
      categoryBits: COLLISION_MASKS.PLAYER,
    })
    this.steering = steering
    this.gui = gui
    this.onDeath = onDeath
    this.playerProperties = {
      maxSpeed: properties.maxSpeed ?? 0.5,
      minSpeed: properties.minSpeed ?? 0,
      rotationSpeed: properties.rotationSpeed ?? Math.PI * 1.5,
    }

    this.children.push(new FireballEmitter(this))

    this.gui.setPlayerHP(this.hp)
    this.gui.setPlayerSpeed(this.speed / this.playerProperties.maxSpeed)
  }

  registerEffect(effect: EffectBase, duration: number) {
    this.effects.set(effect.id, { effect, duration })
    this.gui.setPlayerEffects(Array.from(this.effects.values()))
  }

  unregisterEffect(effect: EffectBase) {
    this.effects.delete(effect.id)
    this.gui.setPlayerEffects(Array.from(this.effects.values()))
  }

  getActiveEffects(): Readonly<{ effect: EffectBase; duration: number }[]> {
    return Array.from(this.effects.values())
  }

  inflictDamage(damage: number) {
    this.hp = clamp(this.hp - damage, 0, 1)
    this.gui.setPlayerHP(this.hp, damage)
    if (this.hp <= 0) {
      this.onDeath()
    }
  }

  heal(factor: number) {
    if (this.hp === 1) {
      return false
    }
    this.hp = clamp(this.hp + factor, 0, 1)
    this.gui.setPlayerHP(this.hp)
    return true
  }

  update(deltaTime: number) {
    // Smoothly keep constant velocity
    const currentVelocity = this.body.GetLinearVelocity()
    let speed = currentVelocity.Length()

    let movingAngle =
      speed < 1e-5
        ? Math.PI / 2
        : Math.atan2(currentVelocity.y, currentVelocity.x)
    if (this.steering.left) {
      movingAngle += deltaTime * this.playerProperties.rotationSpeed
    }
    if (this.steering.right) {
      movingAngle -= deltaTime * this.playerProperties.rotationSpeed
    }

    if (this.steering.up) {
      this.speed = Math.min(
        this.playerProperties.maxSpeed,
        this.speed + deltaTime * Player.ACCELERATION,
      )
      this.gui.setPlayerSpeed(this.speed / this.playerProperties.maxSpeed)
    }
    if (this.steering.down) {
      this.speed = Math.max(
        this.playerProperties.minSpeed,
        this.speed - deltaTime * Player.ACCELERATION,
      )
      this.gui.setPlayerSpeed(this.speed / this.playerProperties.maxSpeed)
    }

    const targetSpeed = PhysicsParameters.SCALAR * this.speed

    const speedDiff = targetSpeed - speed
    speed +=
      speedDiff *
      Math.max(1 / 60, Math.min(1, deltaTime * Player.SPEED_SMOOTHNESS))

    this.body.SetLinearVelocity(
      new Box2D.Vec2(
        Math.cos(movingAngle) * speed,
        Math.sin(movingAngle) * speed,
      ),
    )

    const currentRotationVector = new Vector2(
      Math.cos(this.angle),
      Math.sin(this.angle),
    )
    const smoothAngle = currentRotationVector
      .lerp(
        new Vector2(currentVelocity.x, currentVelocity.y),
        deltaTime * Player.ANGLE_SMOOTHNESS,
      )
      .toAngle()

    this.setAngle(smoothAngle)

    return super.update(deltaTime)
  }
}
