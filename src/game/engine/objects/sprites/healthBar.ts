import { SECOND, clamp } from '../../../../utils'
import { SPRITE_MATERIAL } from '../common'
import { ObjectBase } from '../objectBase'
import { SpriteBase } from './spriteBase'

export class HealthBar extends SpriteBase {
  private static POP_UP_DURATION = SECOND * 0.5
  private static HEIGHT_SCALE = 0.2

  private readonly target: ObjectBase

  private value = 1
  private timer = 0

  constructor(target: ObjectBase) {
    super({
      material: SPRITE_MATERIAL.HEALTH_BAR,
    })

    this.target = target
  }

  setValue(value: number) {
    this.value = clamp(value, 0, 1)
  }

  update(deltaTime: number) {
    this.timer += deltaTime

    const scalar = clamp((this.timer * SECOND) / HealthBar.POP_UP_DURATION)

    this._pos.set(
      this.target.position.x,
      this.target.position.y,
      this.target.position.z +
        (this.target.scale.z +
          this.target.scale.y * HealthBar.HEIGHT_SCALE * 0.5) *
          scalar,
    )
    this._scale.set(
      this.target.scale.x * 2 * this.value * scalar,
      this.target.scale.y * HealthBar.HEIGHT_SCALE * scalar,
      scalar,
    )
    this._color.g = this._color.b = 0.1

    super.update(deltaTime)
    super.updateRenderer(null)
  }
}
