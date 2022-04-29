import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../../utils'
import { COLLISION_MASKS, OBJECT_MATERIAL, OBJECT_TYPE } from '../common'
import { BulletBase } from './bulletBase'

export class SimpleBullet extends BulletBase {
  private static STRENGTH = 0.25
  private static SPEED = 2

  constructor(pos: Vector3, angle: number, world: Box2D.World) {
    super(pos, world, {
      type: OBJECT_TYPE.SIMPLE_BULLET,
      material: OBJECT_MATERIAL.SIMPLE_BULLET,
      strength: SimpleBullet.STRENGTH,
      speed: SimpleBullet.SPEED,
      startAngle: angle,
      maskBits: 0xffff ^ COLLISION_MASKS.PLAYER,
    })
  }
}
