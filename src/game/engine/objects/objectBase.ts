import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'
import {
  DefaultProperties,
  OBJECT_MATERIAL,
  OBJECT_TYPE,
  Updatable,
  updateUpdatables,
} from './common'

export interface CommonObjectProperties {
  type: OBJECT_TYPE
  material?: OBJECT_MATERIAL
  static?: boolean
}

export abstract class ObjectBase extends Renderable<null> implements Updatable {
  public readonly properties: Readonly<CommonObjectProperties>
  public readonly children: Updatable[] = []

  private _destroyed = false
  protected readonly _pos = new Vector3()
  protected readonly _scale = new Vector3()
  protected _angle = 0

  constructor(properties: CommonObjectProperties) {
    super()
    this.properties = {
      type: properties.type ?? OBJECT_TYPE.BOX,
      material: properties.material,
      static: properties.static ?? false,
    }

    this._scale.setV(DefaultProperties[this.properties.type].scale)
  }

  destroy() {
    super.destroy()
    for (const child of this.children) {
      child.destroy()
    }
    this._destroyed = true
  }

  get destroyed() {
    return this._destroyed
  }

  update(deltaTime: number) {
    updateUpdatables(this.children, deltaTime)
  }

  get position(): Readonly<Vector3> {
    return this._pos
  }
  get scale(): Readonly<Vector3> {
    return this._scale
  }
  get angle(): number {
    return this._angle
  }
}
