import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../../utils'
import { OBJECT_MATERIAL, OBJECT_TYPE } from '../common'
import { DynamicObject } from '../dynamicObject'
import { Player } from '../player'
import { EffectBase } from './effectBase'

export class HealEffect extends EffectBase {
  private static STRENGTH = 0.2
  private static ROTATION_SPEED = 0.5

  constructor(pos: Vector3, world: Box2D.World) {
    super(pos, world, {
      icon: '💊', //TODO
      type: OBJECT_TYPE.HEAL_PLUS,
      material: OBJECT_MATERIAL.HEAL_PLUS,
    })
  }

  applyEffect(target: DynamicObject) {
    if (target instanceof Player) {
      if (!target.heal(HealEffect.STRENGTH)) {
        return
      }
      this.shouldBeDeleted = true
    }
  }

  update(deltaTime: number) {
    super.setAngle(this.angle - Math.PI * deltaTime * HealEffect.ROTATION_SPEED)
    super.updateRenderer(null)

    super.update(deltaTime)
  }
}
