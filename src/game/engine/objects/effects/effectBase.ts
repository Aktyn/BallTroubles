import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../../utils'

import { DynamicObject, DynamicObjectProperties } from '../dynamicObject'

interface EffectBaseProperties extends DynamicObjectProperties {
  icon: string //TODO
}

export abstract class EffectBase extends DynamicObject {
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
  }

  abstract applyEffect(target: DynamicObject): void
}
