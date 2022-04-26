import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../utils'
import { OBJECT_MATERIAL } from './common'
import { EnemyBase } from './enemyBase'

export class RockEnemy extends EnemyBase {
  readonly strength = 0.15

  constructor(pos: Vector3, world: Box2D.World) {
    super(pos, world, {
      speed: 0.4,
      material: OBJECT_MATERIAL.ROCK_ENEMY,
    })
  }
}
