import Box2D from '@cocos/box2d'
import { v4 as uuid } from 'uuid'
import { Vector3 } from '../../../../utils'

import { DynamicObject, DynamicObjectProperties } from '../dynamicObject'

interface EffectBaseProperties extends DynamicObjectProperties {
  icon?: string
}

export abstract class EffectBase extends DynamicObject {
  readonly id: string
  private readonly effectProperties: EffectBaseProperties

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: EffectBaseProperties,
  ) {
    super(pos, world, {
      static: true,
      isSensor: true,
      ...properties,
    })
    this.effectProperties = properties

    this.id = uuid()
  }

  get icon() {
    return this.effectProperties.icon ?? null
  }

  abstract applyEffect(target: DynamicObject): void
}
