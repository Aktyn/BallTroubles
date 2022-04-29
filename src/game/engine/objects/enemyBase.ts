import Box2D from '@cocos/box2d'
import { clamp, Vector2, Vector3 } from '../../../utils'
import { PhysicsParameters } from '../../physics/utils'
import { OBJECT_TYPE } from './common'
import { DynamicObject, DynamicObjectProperties } from './dynamicObject'
import { HealthBar } from './sprites/healthBar'

interface EnemyProperties {
  speed?: number
}

export abstract class EnemyBase extends DynamicObject {
  private static SPEED_SMOOTHNESS = 2
  private static ANGLE_SMOOTHNESS = 4

  private readonly enemyProperties: Required<EnemyProperties>

  abstract readonly strength: number

  private hp = 1
  private healthBar: HealthBar | null = null

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: EnemyProperties & Partial<DynamicObjectProperties> = {},
  ) {
    super(pos, world, {
      type: OBJECT_TYPE.SMALL_BALL,
      friction: 0.5,
      restitution: 1,
      ...properties,
    })
    this.enemyProperties = {
      speed: properties.speed ?? 0.4,
    }
  }

  inflictDamage(damage: number) {
    this.hp = clamp(this.hp - damage, 0, 1)
    if (this.hp < 1 && !this.healthBar) {
      this.children.push((this.healthBar = new HealthBar(this)))
    }
    this.healthBar?.setValue(this.hp)

    if (this.hp <= 0) {
      this.shouldBeDeleted = true
      return true
    }
    return false
  }

  update(deltaTime: number) {
    // Smoothly keep constant velocity
    const currentVelocity = this.body.GetLinearVelocity()
    let speed = currentVelocity.Length()

    const movingAngle =
      speed < 1e-5
        ? Math.PI / 2
        : Math.atan2(currentVelocity.y, currentVelocity.x)

    const targetSpeed = PhysicsParameters.SCALAR * this.enemyProperties.speed

    const speedDiff = targetSpeed - speed
    speed +=
      speedDiff *
      Math.max(1 / 60, Math.min(1, deltaTime * EnemyBase.SPEED_SMOOTHNESS))

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
        deltaTime * EnemyBase.ANGLE_SMOOTHNESS,
      )
      .toAngle()

    this.setAngle(smoothAngle)

    return super.update(deltaTime)
  }
}
