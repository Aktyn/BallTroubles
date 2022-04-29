import { RGB, Vector3 } from '../../../../utils'
import { Renderable } from '../../common/renderable'
import { SPRITE_MATERIAL, Updatable } from '../common'

interface SpriteBaseProperties {
  material: SPRITE_MATERIAL
}

export class SpriteBase extends Renderable<null> implements Updatable {
  public readonly properties: Readonly<SpriteBaseProperties>

  private _destroyed = false
  public shouldBeDeleted = false
  protected readonly _pos = new Vector3()
  protected readonly _scale = new Vector3()
  protected readonly _color: RGB = { r: 1, g: 1, b: 1 }

  constructor(properties: SpriteBaseProperties) {
    super()

    this.properties = properties
  }

  destroy() {
    super.destroy()
    this._destroyed = true
  }

  get destroyed() {
    return this._destroyed
  }

  get position(): Readonly<Vector3> {
    return this._pos
  }
  get scale(): Readonly<Vector3> {
    return this._scale
  }
  get color(): Readonly<RGB> {
    return this._color
  }

  update(_deltaTime: number) {
    // noop
  }
}
