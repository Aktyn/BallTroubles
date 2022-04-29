import Box2D from '@cocos/box2d'
import { SECOND, Vector3 } from '../../../../utils'
import { HealEmitter } from '../../emitters/healEmitter'
import { DefaultProperties, OBJECT_MATERIAL, OBJECT_TYPE } from '../common'
import { DynamicObject } from '../dynamicObject'
import { Player } from '../player'
import { EffectBase } from './effectBase'

export class HealEffect extends EffectBase {
  private static STRENGTH = 0.2
  private static ROTATION_SPEED = 0.5
  private static USAGE_EFFECT_DURATION = 2000

  private timer = 0

  constructor(pos: Vector3, world: Box2D.World) {
    super(pos, world, {
      type: OBJECT_TYPE.HEAL_PLUS,
      material: OBJECT_MATERIAL.HEAL_PLUS,
    })
  }

  applyEffect(target: DynamicObject) {
    if (this.timer) {
      return
    }
    if (target instanceof Player) {
      if (!target.heal(HealEffect.STRENGTH)) {
        return
      }
      this.timer = 1e-6
      this.children.push(
        new HealEmitter(this, HealEffect.USAGE_EFFECT_DURATION),
      )
    }
  }

  update(deltaTime: number) {
    if (this.timer > 0) {
      this.timer += deltaTime
      if (this.timer * SECOND > HealEffect.USAGE_EFFECT_DURATION) {
        this.shouldBeDeleted = true
      } else {
        const scale = Math.max(
          0,
          1 - (this.timer * SECOND) / HealEffect.USAGE_EFFECT_DURATION,
        )
        this._scale.setV(
          DefaultProperties[OBJECT_TYPE.HEAL_PLUS].scale.copy().scale(scale),
        )
      }
    }

    super.setAngle(this.angle - Math.PI * deltaTime * HealEffect.ROTATION_SPEED)
    super.updateRenderer(null)

    return super.update(deltaTime)
  }
}
