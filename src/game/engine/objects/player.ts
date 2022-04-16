import Box2D from '@cocos/box2d'
import { Vector2, Vector3 } from '../../../utils'
import { PhysicsParameters } from '../../physics/utils'
import { Steering } from '../common/steering'
import { EmitterBase } from '../emitters/emitterBase'
import { FireballEmitter } from '../emitters/fireballEmitter'
import { OBJECT_MATERIAL, OBJECT_TYPE } from './common'
import { DynamicObject } from './dynamicObject'

interface PlayerProperties {
  speed?: number
  rotationSpeed?: number
}

export class Player extends DynamicObject {
  private static SPEED_SMOOTHNESS = 2
  private static ANGLE_SMOOTHNESS = 4

  private readonly steering: Steering
  private readonly playerProperties: Required<PlayerProperties>
  public readonly emitter: EmitterBase

  constructor(
    steering: Steering,
    world: Box2D.World,
    properties: PlayerProperties = {},
  ) {
    super(new Vector3(), world, {
      type: OBJECT_TYPE.SMALL_BALL,
      material: OBJECT_MATERIAL.PLAYER,
      friction: 0,
    })
    this.playerProperties = {
      speed: properties.speed ?? 0.3,
      rotationSpeed: properties.rotationSpeed ?? Math.PI,
    }
    this.steering = steering
    this.emitter = new FireballEmitter(this)
  }

  destroy() {
    this.emitter.destroy()
    super.destroy()
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

    const targetSpeed = PhysicsParameters.SCALAR * this.playerProperties.speed

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

    super.update(deltaTime)
  }
}
