import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../utils'
import { Box2DShapes } from '../../physics/box2dResources'
import { b2BodyType, PhysicsParameters } from '../../physics/utils'
import { ObjectBase, CommonObjectProperties } from './objectBase'

interface DynamicObjectProperties extends CommonObjectProperties {
  restitution?: number
  density?: number
  friction?: number
}

export class DynamicObject extends ObjectBase {
  private readonly body: Box2D.Body

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: DynamicObjectProperties,
  ) {
    super(properties)

    this._pos.setV(pos)

    // const fixture = new Box2D.FixtureDef()
    // fixture.restitution = properties.restitution ?? 0.99
    // fixture.density = properties.density ?? 1
    // fixture.friction = properties.friction ?? 0.5

    // const shape = new Box2D.CircleShape(
    //   this._scale.getAverage() * PhysicsParameters.SCALAR,
    // )

    this.body = world.CreateBody()
    this.body.SetType(
      properties.static ? b2BodyType.b2_staticBody : b2BodyType.b2_dynamicBody,
    )
    this.body.SetLinearDamping(0)
    this.body.SetAngularDamping(0)
    this.body.SetPosition(pos.copy().scale(PhysicsParameters.SCALAR).toJSON())

    // const ballShape = new Box2D.CircleShape(
    //   this._scale.getAverage() * PhysicsParameters.SCALAR,
    // )
    const shape = Box2DShapes[this.properties.shape]
    this.body.CreateFixture(shape, 1)

    const bodyFixture = this.body.m_fixtureList
    if (bodyFixture) {
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

  set speed(value: number) {
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

  update(_deltaTime: number): void {
    const bodyPos = this.body.GetPosition()
    this._pos.x = bodyPos.x / PhysicsParameters.SCALAR
    this._pos.y = bodyPos.y / PhysicsParameters.SCALAR
    this._angle = this.body.GetAngle()

    if (!this.properties.static) {
      super.updateRenderer(null)
    }
  }
}
