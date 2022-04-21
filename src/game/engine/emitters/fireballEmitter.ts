import { randomFloat, Vector3 } from '../../../utils'
import { OBJECT_MATERIAL } from '../objects/common'
import { ObjectBase } from '../objects/objectBase'
import { EmitterBase } from './emitterBase'

export class FireballEmitter extends EmitterBase {
  private static PARTICLE_SIZE_MAX = 100 as const
  private static PARTICLE_SIZE_MIN = 5 as const
  private static SHRINKING_SPEED = 1 as const
  private static SPAWN_RADIUS_OFFSET = -0.2 as const
  private static BASE_COLOR = [0.5, 0.15, 0] as const

  private readonly parent: ObjectBase
  private readonly targetPositions: Float32Array

  constructor(parent: ObjectBase) {
    super({
      particlesCount: 100,
      material: OBJECT_MATERIAL.FIRE_PARTICLE,
      frustumCulled: false,
    })
    this.parent = parent

    this.targetPositions = new Float32Array(this.properties.particlesCount * 3)
    this.initialize()
  }

  private initialize() {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] = randomFloat(0, FireballEmitter.PARTICLE_SIZE_MAX)
    }
    this.colors.fill(0)
    this.positions.fill(1000) //init particles outside of the viewport
    this.targetPositions.fill(1000)
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] -=
        deltaTime *
        FireballEmitter.PARTICLE_SIZE_MAX *
        FireballEmitter.SHRINKING_SPEED
      if (this.sizes[i] <= FireballEmitter.PARTICLE_SIZE_MIN) {
        this.sizes[i] +=
          FireballEmitter.PARTICLE_SIZE_MAX - FireballEmitter.PARTICLE_SIZE_MIN

        const randomVector = new Vector3(
          randomFloat(-1, 1),
          randomFloat(-1, 1),
          randomFloat(-1, 1),
        )
          .normalize()
          .scaleV(this.parent.scale)
          .scale(1 + FireballEmitter.SPAWN_RADIUS_OFFSET)
          .addV(this.parent.position)

        this.targetPositions[i * 3 + 0] = this.parent.position.x
        this.targetPositions[i * 3 + 1] = this.parent.position.y
        this.targetPositions[i * 3 + 2] = this.parent.position.z

        this.positions[i * 3 + 0] = randomVector.x
        this.positions[i * 3 + 1] = randomVector.y
        this.positions[i * 3 + 2] = randomVector.z

        this.colors[i * 3 + 0] = 0
        this.colors[i * 3 + 1] = 0
        this.colors[i * 3 + 2] = 0
      } else {
        for (let j = 0; j < 3; j++) {
          const ii = i * 3 + j
          this.positions[ii] +=
            (this.targetPositions[ii] - this.positions[ii]) *
            Math.min(1, deltaTime * this.parent.scale.x * 40)

          this.colors[ii] =
            FireballEmitter.BASE_COLOR[j] *
            Math.min(
              (1 - this.sizes[i] / FireballEmitter.PARTICLE_SIZE_MAX) * 8,
              1,
            )
        }
      }
    }
    this.updateRenderer({
      updateSizes: true,
      updatePositions: true,
      updateColors: true,
    })
  }
}
