import { randomFloat, RGB, Vector3 } from '../../../utils'
import { OBJECT_MATERIAL } from '../objects/common'
import { Portal } from '../objects/portal'
import { EmitterBase } from './emitterBase'

export class PortalEmitter extends EmitterBase {
  private static PARTICLE_SIZE_MAX = 70 as const
  private static GROWING_SPEED = 1 as const
  private static START_RADIUS = 0.2 as const

  private readonly portal: Portal
  private readonly color: RGB

  private startPositions: Float32Array

  constructor(portal: Portal, color: RGB) {
    super({
      particlesCount: 100,
      material: OBJECT_MATERIAL.SIMPLE_PARTICLE,
      frustumCulled: true,
    })
    this.portal = portal
    this.color = color

    this.startPositions = new Float32Array(this.properties.particlesCount * 3)

    this.initialize()
  }

  private initialize() {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] = randomFloat(0, PortalEmitter.PARTICLE_SIZE_MAX)

      this.colors[i * 3 + 0] = this.color.r
      this.colors[i * 3 + 1] = this.color.g
      this.colors[i * 3 + 2] = this.color.b

      const randomStart = new Vector3(
        randomFloat(-1, 1),
        randomFloat(-1, 1),
        randomFloat(-1, 1),
      )
        .normalize()
        .scale(PortalEmitter.START_RADIUS)
      this.startPositions[i * 3 + 0] = randomStart.x
      this.startPositions[i * 3 + 1] = randomStart.y
      this.startPositions[i * 3 + 2] = randomStart.z
    }
    this.positions.fill(0) //! init particles outside of the viewport
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.properties.particlesCount; i++) {
      this.sizes[i] +=
        deltaTime *
        PortalEmitter.PARTICLE_SIZE_MAX *
        PortalEmitter.GROWING_SPEED
      if (this.sizes[i] >= PortalEmitter.PARTICLE_SIZE_MAX) {
        this.sizes[i] -= PortalEmitter.PARTICLE_SIZE_MAX
      } else {
        const scale = Math.max(
          0,
          Math.pow(1 - this.sizes[i] / PortalEmitter.PARTICLE_SIZE_MAX, 1),
        )

        for (let j = 0; j < 3; j++) {
          const ii = i * 3 + j

          this.positions[ii] = this.startPositions[ii] * scale
        }
      }
    }

    const updateCenterPosition = !this.centerPosition.equals(
      this.portal.position,
    )
    if (updateCenterPosition) {
      this.centerPosition.setV(this.portal.position)
    }

    this.updateRenderer({
      updateSizes: true,
      updatePositions: true,
      updateCenterPosition,
    })
  }
}
