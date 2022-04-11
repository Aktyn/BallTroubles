import Box2D from '@cocos/box2d'
import { b2BodyType, PhysicsParameters } from 'game/physics/utils'
import { Vector2, XY } from 'utils'
import { ObjectBase } from './objectBase'

interface DynamicObjectProperties {
  restitution: number
  density: number
  friction: number
  bodyType: b2BodyType
}

export class DynamicObject extends ObjectBase {
  private readonly body: Box2D.Body

  constructor(
    pos: XY | Vector2,
    scale: XY | Vector2,
    world: Box2D.World,
    properties: Partial<DynamicObjectProperties> = {},
  ) {
    super(pos, scale)

    // const fixture = new Box2D.FixtureDef()
    // fixture.restitution = properties.restitution ?? 0.99
    // fixture.density = properties.density ?? 1
    // fixture.friction = properties.friction ?? 0.5

    const shape = new Box2D.CircleShape(
      this._scale.getAverage() * PhysicsParameters.SCALAR,
    )

    this.body = world.CreateBody()
    this.body.SetType(properties.bodyType ?? b2BodyType.b2_dynamicBody)
    this.body.SetLinearDamping(0)
    this.body.SetAngularDamping(0)
    this.body.SetPosition(
      new Vector2(pos.x, pos.y).scale(PhysicsParameters.SCALAR),
    )

    // const ballShape = new Box2D.CircleShape(
    //   this._scale.getAverage() * PhysicsParameters.SCALAR,
    // )
    this.body.CreateFixture(shape, 0.2)
    // this.body.CreateFixture(ballShape, 0.2)

    const bodyFixture = this.body.m_fixtureList
    if (bodyFixture) {
      bodyFixture.SetDensity(properties.density ?? 100)
      bodyFixture.SetRestitution(properties.restitution ?? 1)
      bodyFixture.SetFriction(properties.friction ?? 0)
    }
  }

  // get speed() {
  //   return this._speed
  // }

  set speed(value: number) {
    // this._speed = clamp(value, 0, MAX_SPEED)
    this.body.SetLinearVelocity(
      new Box2D.Vec2(
        Math.cos(this._angle) * value * PhysicsParameters.SCALAR,
        Math.sin(this._angle) * value * PhysicsParameters.SCALAR,
      ),
    )
  }

  // get angularSpeed() {
  //   return this._angularSpeed
  // }

  set angularSpeed(value: number) {
    // this._angularSpeed = value
    this.body.SetAngularVelocity(value)
  }

  set angle(value: number) {
    this._angle = value
    this.body.SetAngle(value)
  }

  update(_deltaTime: number): void {
    // this._angle += this._angularSpeed * deltaTime
    // this._pos.add(
    //   Math.cos(this._angle) * this._speed,
    //   Math.sin(this._angle) * this._speed,
    // )

    const bodyPos = this.body.GetPosition()
    this._pos.x = bodyPos.x / PhysicsParameters.SCALAR
    this._pos.y = bodyPos.y / PhysicsParameters.SCALAR

    // console.log(this._pos.x, this.body.m_linearVelocity.x)
    this.updateMatrix()
  }
}
