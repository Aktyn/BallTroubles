import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../utils'
import { Box2DShapes } from '../../physics/box2dResources'
import { b2BodyType, PhysicsParameters } from '../../physics/utils'
import { ObjectBase, CommonObjectProperties } from './objectBase'

interface DynamicObjectProperties extends CommonObjectProperties {
  /** @default 1 */
  restitution?: number
  /** @default 1 */
  density?: number
  /** @default 0.5 */
  friction?: number
  /** @default false */
  isSensor?: boolean
}

export class DynamicObject extends ObjectBase {
  protected readonly body: Box2D.Body

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: DynamicObjectProperties,
  ) {
    super(properties)

    this._pos.setV(pos)

    this.body = world.CreateBody()
    this.body.SetType(
      properties.static ? b2BodyType.b2_staticBody : b2BodyType.b2_dynamicBody,
    )
    this.body.SetLinearDamping(0)
    this.body.SetAngularDamping(0)
    this.body.SetPosition(pos.copy().scale(PhysicsParameters.SCALAR).toJSON())

    const shape = Box2DShapes[this.properties.type]
    this.body.CreateFixture(shape, 1)

    const bodyFixture = this.body.m_fixtureList
    if (bodyFixture) {
      bodyFixture.m_userData = this
      bodyFixture.m_isSensor = properties.isSensor ?? false
      bodyFixture.SetDensity(properties.density ?? 1)
      bodyFixture.SetRestitution(properties.restitution ?? 1)
      bodyFixture.SetFriction(properties.friction ?? 0)
    }
  }

  destroy() {
    let fixture = this.body.m_fixtureList
    while (fixture) {
      const next = fixture.m_next
      this.body.DestroyFixture(fixture)
      fixture = next
    }
    this.body.m_world.DestroyBody(this.body)

    super.destroy()
  }

  setLinearVelocity(value: number) {
    this.body.SetLinearVelocity(
      new Box2D.Vec2(
        Math.cos(this._angle) * value * PhysicsParameters.SCALAR,
        Math.sin(this._angle) * value * PhysicsParameters.SCALAR,
      ),
    )
  }

  set angularSpeed(value: number) {
    this.body.SetAngularVelocity(value)
  }

  setAngle(value: number) {
    this._angle = value
    this.body.SetAngle(value)
  }

  setPosition(pos: Vector3) {
    this.body.SetPosition(pos.copy().scale(PhysicsParameters.SCALAR).toJSON())
    this._pos.setV(pos)
  }

  update(deltaTime: number): void {
    const bodyPos = this.body.GetPosition()
    this._pos.x = bodyPos.x / PhysicsParameters.SCALAR
    this._pos.y = bodyPos.y / PhysicsParameters.SCALAR
    this._angle = this.body.GetAngle()

    super.update(deltaTime)
    if (!this.properties.static) {
      super.updateRenderer(null)
    }
  }
}
