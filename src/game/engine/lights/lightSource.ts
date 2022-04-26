import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'
import { Updatable } from '../objects/common'

export abstract class LightSource
  extends Renderable<null>
  implements Updatable
{
  private _destroyed = false
  public shouldBeDeleted = false
  protected readonly _position: Vector3 = new Vector3()
  protected readonly _targetPosition: Vector3 = new Vector3()
  protected readonly _color: Vector3 = new Vector3(1, 1, 1)

  //TODO: options for shadows and other light source properties
  constructor() {
    super()
  }

  destroy() {
    super.destroy()
    this._destroyed = true
  }

  get destroyed() {
    return this._destroyed
  }

  get position(): Readonly<Vector3> {
    return this._position
  }

  get targetPosition(): Readonly<Vector3> {
    return this._targetPosition
  }

  get color(): Readonly<Vector3> {
    return this._color
  }

  abstract update(deltaTime: number): void
}
