import { Vector3 } from '../../../utils'
import { LightSource } from './lightSource'

export class SunLight extends LightSource {
  private timer = 0

  constructor(position: Vector3) {
    super()

    this._position.setV(position)
  }

  destroy() {
    super.destroy()
  }

  setTargetPosition(position: Vector3) {
    this._targetPosition.setV(position)
    super.updateRenderer(null)
  }

  update(deltaTime: number) {
    this.timer += deltaTime * 0.2

    this._color.x = Math.max(0.5, Math.abs(Math.sin(this.timer)))
    this._color.y = Math.max(0.5, Math.abs(Math.cos(this.timer * 1.5)))
    this._color.z = Math.max(0.5, Math.abs(Math.sin(-this.timer * 2)))

    // this._targetPosition.x = Math.sin(this.timer) * 1
    // this._targetPosition.y = Math.cos(this.timer) * 1

    super.updateRenderer(null)
  }
}
