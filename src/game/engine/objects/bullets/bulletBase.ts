import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../../utils'
import { DynamicObject, DynamicObjectProperties } from '../dynamicObject'

interface BulletBaseProperties extends DynamicObjectProperties {
  strength: number
  speed: number
  startAngle?: number
}

export class BulletBase extends DynamicObject {
  private readonly bulletProperties: BulletBaseProperties

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: BulletBaseProperties,
  ) {
    super(pos, world, {
      static: false,
      isSensor: false,
      isBullet: true,
      friction: 1,
      restitution: 1,
      density: 5,
      ...properties,
    })
    this.bulletProperties = properties

    super.setAngle(properties.startAngle ?? 0)
    super.setLinearVelocity(properties.speed)
  }

  get strength() {
    return this.bulletProperties.strength
  }

  update(deltaTime: number) {
    const vel = super.getLinearVelocity()
    super.setAngle(Math.atan2(vel.y, vel.x))
    super.setLinearVelocity(this.bulletProperties.speed)

    return super.update(deltaTime)
  }
}
