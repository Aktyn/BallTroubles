import Box2D from '@cocos/box2d'
import { randomFloat, Vector3 } from '../../../utils'
import { PortalEmitter } from '../emitters/portalEmitter'
import { Vector2 } from './../../../utils/math/vector'
import { OBJECT_TYPE } from './common'
import { DynamicObject } from './dynamicObject'

const groupColors = [
  {
    r: (102 / 255) * 0.5,
    g: (187 / 255) * 0.5,
    b: (106 / 255) * 0.5,
  },
  {
    r: (171 / 255) * 0.5,
    g: (71 / 255) * 0.5,
    b: (188 / 255) * 0.5,
  },
]

export class Portal extends DynamicObject {
  private static PULLING_SPEED = 0.4 as const

  private readonly emitter: PortalEmitter
  public readonly groupNumber: number

  private targetObject: DynamicObject | null = null
  private teleportedObject: DynamicObject[] = []
  private exitPortal: Portal | null = null

  constructor(pos: Vector3, world: Box2D.World, groupNumber: number) {
    super(pos, world, {
      type: OBJECT_TYPE.PORTAL,
      static: true,
      isSensor: true,
    })
    this.groupNumber = groupNumber

    this.emitter = new PortalEmitter(
      this,
      groupColors[groupNumber % groupColors.length],
    )
    this.emitter.position.setV(pos)
    this.children.push(this.emitter)
  }

  teleport(object: DynamicObject, exitPortal: Portal) {
    // Object must first leave the teleport it has teleported to
    if (this.teleportedObject.includes(object)) {
      return
    }

    this.targetObject = object
    this.exitPortal = exitPortal
  }

  private waitForObjectToLeave(object: DynamicObject) {
    this.teleportedObject.push(object)
  }

  objectLeftTeleport(object: DynamicObject) {
    const objIndex = this.teleportedObject.indexOf(object)
    if (objIndex !== -1) {
      this.teleportedObject.splice(objIndex, 1)
    }
  }

  update(deltaTime: number) {
    if (this.targetObject && this.exitPortal) {
      const posDiff = this.position.subtractV(this.targetObject.position)

      const diffLength = posDiff.getLengthSquared()

      const targetVector = new Vector2(
        Math.cos(this.targetObject.angle),
        Math.sin(this.targetObject.angle),
      )
      const vectorsDot = targetVector.dot(posDiff.copy().normalize())

      const stepVector = posDiff
        .normalize()
        .scale(
          Portal.PULLING_SPEED * deltaTime * Math.max(1, (1 - vectorsDot) * 4),
        )

      const stepLength = stepVector.getLengthSquared()

      if (stepLength >= diffLength) {
        const randomOffsetLength = 1e-6

        this.exitPortal.waitForObjectToLeave(this.targetObject)
        this.targetObject.setPosition(
          this.targetObject.position
            .setV(this.exitPortal.position)
            //add some randomness to the position to prevent objects from being stuck in each other
            .add(
              randomFloat(-randomOffsetLength, randomOffsetLength),
              randomFloat(-randomOffsetLength, randomOffsetLength),
            ),
        )
        this.targetObject = this.exitPortal = null
      } else {
        this.targetObject.setPosition(
          this.targetObject.position.addV(stepVector),
        )
      }
    }

    super.update(deltaTime)
  }
}
