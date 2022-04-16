import { randomFloat, Vector3 } from '../../../utils'
import { EmitterBase } from './emitterBase'

interface StarsEmitterProperties {
  xRotationSpeed: number
  yRotationSpeed: number
  zRotationSpeed: number
}

export class StarsEmitter extends EmitterBase {
  private static readonly GLOBAL_ROTATION_SPEED = 0.005

  private readonly starsProperties: StarsEmitterProperties

  constructor(properties: StarsEmitterProperties) {
    super({
      particlesCount: 500,
    })
    this.starsProperties = properties

    this.initialize()
  }

  destroy() {
    super.destroy()
  }

  private initialize() {
    const skyDomeRadius = 5 // More than camera distance from the center point but no more than camera far plane

    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] = randomFloat(10, 30)

      this.colors[i * 3 + 0] = randomFloat(0, 1)
      this.colors[i * 3 + 1] = randomFloat(0.5, 1)
      this.colors[i * 3 + 2] = randomFloat(0.75, 1)

      const randomVector = new Vector3(
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
      )
        .normalize()
        .scale(skyDomeRadius)
      this.positions[i * 3 + 0] = randomVector.x
      this.positions[i * 3 + 1] = randomVector.y
      this.positions[i * 3 + 2] = randomVector.z
    }
  }

  update(deltaTime: number) {
    this.centerRotation.x +=
      deltaTime *
      this.starsProperties.xRotationSpeed *
      StarsEmitter.GLOBAL_ROTATION_SPEED
    this.centerRotation.y +=
      deltaTime *
      this.starsProperties.yRotationSpeed *
      StarsEmitter.GLOBAL_ROTATION_SPEED
    this.centerRotation.z +=
      deltaTime *
      this.starsProperties.zRotationSpeed *
      StarsEmitter.GLOBAL_ROTATION_SPEED

    super.updateRenderer({
      updateCenterRotation: true,
    })
  }
}
