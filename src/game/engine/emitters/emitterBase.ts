import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'
import { OBJECT_MATERIAL, Updatable } from '../objects/common'

interface EmitterProperties {
  particlesCount: number
  material: OBJECT_MATERIAL
  /** @default true */
  frustumCulled?: boolean
}

export interface RendererUpdateData {
  updateCenterPosition?: boolean
  updateCenterRotation?: boolean
  updatePositions?: boolean
  updateSizes?: boolean
  updateColors?: boolean
}

export abstract class EmitterBase
  extends Renderable<RendererUpdateData>
  implements Updatable
{
  private _destroyed = false
  readonly properties: Readonly<Required<EmitterProperties>>
  protected readonly sizes: Float32Array
  protected readonly positions: Float32Array
  protected readonly colors: Float32Array

  protected readonly centerPosition = new Vector3()
  protected readonly centerRotation = new Vector3()

  constructor(properties: EmitterProperties) {
    super()
    this.properties = {
      ...properties,
      frustumCulled: properties.frustumCulled ?? true,
    }
    this.sizes = new Float32Array(properties.particlesCount)
    this.positions = new Float32Array(properties.particlesCount * 3)
    this.colors = new Float32Array(properties.particlesCount * 3)
  }

  destroy() {
    super.destroy()
    this._destroyed = true
  }

  get destroyed() {
    return this._destroyed
  }

  get position() {
    return this.centerPosition
  }

  set position(pos: Vector3) {
    this.centerPosition.setV(pos)
  }

  get rotation(): Readonly<Vector3> {
    return this.centerRotation
  }

  get sizeBuffer(): Readonly<Float32Array> {
    return this.sizes
  }

  get positionBuffer(): Readonly<Float32Array> {
    return this.positions
  }

  get colorBuffer(): Readonly<Float32Array> {
    return this.colors
  }

  abstract update(deltaTime: number): void
}
