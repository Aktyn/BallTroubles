import { clamp, randomFloat, SECOND, Vector3 } from '../../../utils'
import { OBJECT_MATERIAL } from '../objects/common'
import { EmitterBase } from './emitterBase'

export class ExplosionEmitter extends EmitterBase {
  private static readonly DURATION = 700

  private static readonly PARTICLE_SIZE_MAX = 1024 * 0.4
  private static readonly ENDING_POS_MIN = 0.075 as const
  private static readonly ENDING_POS_MAX = 0.2 as const

  private static COLOR_BASE = [1, 0.3, 0.2] as const

  private timer = 0
  private readonly randomDirections: Float32Array

  constructor(position: Vector3) {
    super({
      particlesCount: 60,
      material: OBJECT_MATERIAL.FIRE_PARTICLE,
      frustumCulled: true,
    })

    this.randomDirections = new Float32Array(this.properties.particlesCount * 3)
    this.initialize()

    this.position.setV(position)
  }

  private initialize() {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      const randomStart = new Vector3(
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
      )
        .normalize()
        .scale(
          randomFloat(
            ExplosionEmitter.ENDING_POS_MIN,
            ExplosionEmitter.ENDING_POS_MAX,
          ),
        )
      this.randomDirections[i * 3 + 0] = randomStart.x
      this.randomDirections[i * 3 + 1] = randomStart.y
      this.randomDirections[i * 3 + 2] = randomStart.z
    }
    this.colors.fill(1)
    this.sizes.fill(0)
    this.positions.fill(9999)
  }

  update(deltaTime: number) {
    this.timer += deltaTime

    const progress = clamp((this.timer * SECOND) / ExplosionEmitter.DURATION)
    if (progress >= 1) {
      this.destroy()
      return
    }

    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] = ExplosionEmitter.PARTICLE_SIZE_MAX * progress

      for (let j = 0; j < 3; j++) {
        this.positions[i * 3 + j] = this.randomDirections[i * 3 + j] * progress
        this.colors[i * 3 + j] =
          ExplosionEmitter.COLOR_BASE[j] * Math.pow(1 - progress, 2)
      }
    }

    this.updateRenderer({
      updateColors: true,
      updatePositions: true,
      updateSizes: true,
      updateCenterPosition: true,
    })
  }
}
