import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'

interface EmitterProperties {
  particlesCount: number
}

export interface RendererUpdateData {
  updateCenterPosition?: boolean
  updateCenterRotation?: boolean
  updatePositions?: boolean
  updateSizes?: boolean
  updateColors?: boolean
}

export abstract class EmitterBase extends Renderable<RendererUpdateData> {
  protected readonly properties: EmitterProperties
  protected readonly sizes: Float32Array
  protected readonly positions: Float32Array
  protected readonly colors: Float32Array

  protected readonly centerPosition = new Vector3()
  protected readonly centerRotation = new Vector3()

  constructor(properties: EmitterProperties) {
    super()
    this.properties = properties
    this.sizes = new Float32Array(properties.particlesCount)
    this.positions = new Float32Array(properties.particlesCount * 3)
    this.colors = new Float32Array(properties.particlesCount * 3)
  }

  destroy() {
    super.destroy()
  }

  get position(): Readonly<Vector3> {
    return this.centerPosition
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

  get particlesCount() {
    return this.properties.particlesCount
  }

  abstract update(deltaTime: number): void
}
