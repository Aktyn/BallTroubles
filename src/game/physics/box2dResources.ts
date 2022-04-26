import Box2D from '@cocos/box2d'
import { DefaultProperties, OBJECT_TYPE } from '../engine/objects/common'
import { PhysicsParameters } from './utils'

export const Box2DShapes: { [key in OBJECT_TYPE]: Box2D.Shape } = {
  [OBJECT_TYPE.SMALL_BALL]: new Box2D.CircleShape(
    DefaultProperties[OBJECT_TYPE.SMALL_BALL].scale?.getAverage() *
      PhysicsParameters.SCALAR,
  ),
  [OBJECT_TYPE.BOX]: new Box2D.PolygonShape().SetAsBox(
    DefaultProperties[OBJECT_TYPE.BOX].scale.x * 0.5 * PhysicsParameters.SCALAR,
    DefaultProperties[OBJECT_TYPE.BOX].scale.y * 0.5 * PhysicsParameters.SCALAR,
  ),
  [OBJECT_TYPE.PORTAL]: new Box2D.CircleShape(
    DefaultProperties[OBJECT_TYPE.PORTAL].scale?.getAverage() *
      PhysicsParameters.SCALAR,
  ),
  [OBJECT_TYPE.HEAL_PLUS]: new Box2D.PolygonShape().SetAsBox(
    DefaultProperties[OBJECT_TYPE.HEAL_PLUS].scale.x * PhysicsParameters.SCALAR,
    DefaultProperties[OBJECT_TYPE.HEAL_PLUS].scale.y * PhysicsParameters.SCALAR,
  ),
}
