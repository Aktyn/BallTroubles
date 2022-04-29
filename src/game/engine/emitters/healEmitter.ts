import { randomFloat, RGB, Vector3 } from '../../../utils'
import { OBJECT_MATERIAL } from '../objects/common'
import { ObjectBase } from '../objects/objectBase'
import { EmitterBase } from './emitterBase'

export class HealEmitter extends EmitterBase {
  private static PARTICLE_SIZE = 1024 * 0.015
  private static ENDING_POS_MIN = 0.2 as const
  private static ENDING_POS_MAX = 0.4 as const

  private static COLOR: RGB = {
    r: 0.5,
    g: 1,
    b: 0.5,
  }

  private readonly duration: number
  private countdown: number
  private readonly randomDirections: Float32Array

  constructor(target: ObjectBase, duration: number) {
    super({
      particlesCount: 20,
      material: OBJECT_MATERIAL.HEAL_PARTICLE,
      frustumCulled: true,
    })
    this.duration = Math.max(1, duration)
    this.countdown = duration

    this.randomDirections = new Float32Array(this.properties.particlesCount * 3)
    this.initialize()

    this.position.setV(target.position)
  }

  private initialize() {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.colors[i * 3 + 0] = HealEmitter.COLOR.r
      this.colors[i * 3 + 1] = HealEmitter.COLOR.g
      this.colors[i * 3 + 2] = HealEmitter.COLOR.b

      const randomStart = new Vector3(
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
      )
        .normalize()
        .scale(
          randomFloat(HealEmitter.ENDING_POS_MIN, HealEmitter.ENDING_POS_MAX),
        )
      this.randomDirections[i * 3 + 0] = randomStart.x
      this.randomDirections[i * 3 + 1] = randomStart.y
      this.randomDirections[i * 3 + 2] = randomStart.z
    }
    this.sizes.fill(HealEmitter.PARTICLE_SIZE)
    this.positions.fill(9999)
  }

  update(deltaTime: number) {
    this.countdown = Math.max(0, this.countdown - deltaTime * 1000)
    const scale = this.countdown / this.duration

    for (let i = 0; i < this.properties.particlesCount; i++) {
      for (let j = 0; j < 3; j++) {
        this.positions[i * 3 + j] =
          this.randomDirections[i * 3 + j] * (1 - scale)
      }

      this.colors[i * 3 + 0] = HealEmitter.COLOR.r * scale
      this.colors[i * 3 + 1] = HealEmitter.COLOR.g * scale
      this.colors[i * 3 + 2] = HealEmitter.COLOR.b * scale
    }

    this.updateRenderer({
      updateColors: true,
      updatePositions: true,
      updateCenterPosition: true,
    })
  }
}
