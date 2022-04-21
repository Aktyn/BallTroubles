import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../utils'
import { PortalEmitter } from '../emitters/portalEmitter'
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
  private teleportedObject: DynamicObject | null = null
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
    if (this.teleportedObject) {
      return // Object must first leave the teleport it has teleported to
    }
    this.targetObject = object
    this.exitPortal = exitPortal
  }

  private waitForObjectToLeave(object: DynamicObject) {
    this.teleportedObject = object
  }

  objectLeftTeleport(object: DynamicObject) {
    if (this.teleportedObject === object) {
      this.teleportedObject = null
    }
  }

  update(deltaTime: number) {
    if (this.targetObject && this.exitPortal) {
      const posDiff = this.position.subtractV(this.targetObject.position)

      const diffLength = posDiff.getLengthSquared()

      const stepVector = posDiff
        .normalize()
        .scale(Portal.PULLING_SPEED * deltaTime)

      const stepLength = stepVector.getLengthSquared()

      if (stepLength >= diffLength) {
        this.exitPortal.waitForObjectToLeave(this.targetObject)
        this.targetObject.setPosition(
          this.targetObject.position.setV(this.exitPortal.position),
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
