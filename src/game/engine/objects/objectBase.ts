import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'
import { DefaultProperties, OBJECT_MATERIAL, OBJECT_TYPE } from './common'

export interface CommonObjectProperties {
  shape: OBJECT_TYPE
  material?: OBJECT_MATERIAL
  static?: boolean
}

export abstract class ObjectBase extends Renderable<null> {
  public readonly properties: Readonly<Required<CommonObjectProperties>>

  protected _pos = new Vector3()
  protected _scale = new Vector3()
  protected _angle = 0

  constructor(properties: CommonObjectProperties) {
    super()
    this.properties = {
      shape: properties.shape ?? OBJECT_TYPE.BOX,
      material: properties.material ?? OBJECT_MATERIAL.WOODEN_CRATE,
      static: properties.static ?? false,
    }

    this._scale.setV(DefaultProperties[this.properties.shape].scale)
  }

  destroy() {
    super.destroy()
  }

  abstract update(deltaTime: number): void

  get pos() {
    return this._pos
  }
  get scale() {
    return this._scale
  }
  get angle() {
    return this._angle
  }
}
