import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'
import {
  DefaultProperties,
  OBJECT_MATERIAL,
  OBJECT_TYPE,
  Updatable,
} from './common'

export interface CommonObjectProperties {
  type: OBJECT_TYPE
  material?: OBJECT_MATERIAL
  static?: boolean
}

export abstract class ObjectBase extends Renderable<null> implements Updatable {
  public readonly properties: Readonly<Required<CommonObjectProperties>>

  private _destroyed = false
  protected readonly _pos = new Vector3()
  protected readonly _scale = new Vector3()
  protected _angle = 0

  constructor(properties: CommonObjectProperties) {
    super()
    this.properties = {
      type: properties.type ?? OBJECT_TYPE.BOX,
      material: properties.material ?? OBJECT_MATERIAL.WOODEN_CRATE,
      static: properties.static ?? false,
    }

    this._scale.setV(DefaultProperties[this.properties.type].scale)
  }

  destroy() {
    super.destroy()
    this._destroyed = true
  }

  get destroyed() {
    return this._destroyed
  }

  abstract update(deltaTime: number): void

  get position() {
    return this._pos
  }
  get scale() {
    return this._scale
  }
  get angle() {
    return this._angle
  }
}
