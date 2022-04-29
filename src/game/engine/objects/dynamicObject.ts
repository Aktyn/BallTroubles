import Box2D from '@cocos/box2d'
import { Vector3 } from '../../../utils'
import { Box2DShapes } from '../../physics/box2dResources'
import { b2BodyType, PhysicsParameters } from '../../physics/utils'
import { Vector2 } from './../../../utils/math/vector'
import { COLLISION_MASKS } from './common'
import { ObjectBase, CommonObjectProperties } from './objectBase'

export interface DynamicObjectProperties extends CommonObjectProperties {
  /** @default 1 */
  restitution?: number
  /** @default 1 */
  density?: number
  /** @default 0.5 */
  friction?: number
  /** @default false */
  isSensor?: boolean
  /** @default false */
  isBullet?: boolean
  /** @default {@link COLLISION_MASKS.DEFAULT} */
  categoryBits?: number
  /** @default {@link COLLISION_MASKS.ALL} */
  maskBits?: number
}

export class DynamicObject extends ObjectBase {
  protected readonly world: Box2D.World
  protected readonly body: Box2D.Body

  readonly dynamicObjectProperties: Omit<
    Required<DynamicObjectProperties>,
    keyof CommonObjectProperties
  >

  constructor(
    pos: Vector3,
    world: Box2D.World,
    properties: DynamicObjectProperties,
  ) {
    super(properties)
    this.world = world
    this.dynamicObjectProperties = {
      restitution: properties.restitution ?? 1,
      density: properties.density ?? 1,
      friction: properties.friction ?? 0.5,
      isSensor: properties.isSensor ?? false,
      isBullet: properties.isBullet ?? false,
      categoryBits: properties.categoryBits ?? COLLISION_MASKS.DEFAULT,
      maskBits: properties.maskBits ?? COLLISION_MASKS.ALL,
    }

    this._pos.setV(pos)

    this.body = world.CreateBody()
    this.body.SetType(
      properties.static ? b2BodyType.b2_staticBody : b2BodyType.b2_dynamicBody,
    )
    this.body.SetBullet(this.dynamicObjectProperties.isBullet)
    this.body.SetLinearDamping(0)
    this.body.SetAngularDamping(0)
    this.body.SetPosition(pos.copy().scale(PhysicsParameters.SCALAR).toJSON())

    const shape = Box2DShapes[this.properties.type]
    this.body.CreateFixture(shape, this.dynamicObjectProperties.density)

    const bodyFixture = this.body.m_fixtureList
    if (bodyFixture) {
      bodyFixture.m_userData = this
      bodyFixture.m_isSensor = this.dynamicObjectProperties.isSensor
      bodyFixture.SetDensity(this.dynamicObjectProperties.density)
      bodyFixture.SetRestitution(this.dynamicObjectProperties.restitution)
      bodyFixture.SetFriction(this.dynamicObjectProperties.friction)
      bodyFixture.m_filter.categoryBits =
        this.dynamicObjectProperties.categoryBits
      bodyFixture.m_filter.maskBits = this.dynamicObjectProperties.maskBits
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

  setLinearVelocity(value: number, reverseAngle = false) {
    this.body.SetLinearVelocity(
      new Box2D.Vec2(
        Math.cos(this._angle + (reverseAngle ? Math.PI : 0)) *
          value *
          PhysicsParameters.SCALAR,
        Math.sin(this._angle + (reverseAngle ? Math.PI : 0)) *
          value *
          PhysicsParameters.SCALAR,
      ),
    )
  }

  getLinearVelocity() {
    const bodyVelocity = this.body.GetLinearVelocity()
    return new Vector2(
      bodyVelocity.x / PhysicsParameters.SCALAR,
      bodyVelocity.y / PhysicsParameters.SCALAR,
    )
  }

  getSpeed() {
    return this.body.m_linearVelocity.Length()
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

  update(deltaTime: number) {
    const bodyPos = this.body.GetPosition()
    this._pos.x = bodyPos.x / PhysicsParameters.SCALAR
    this._pos.y = bodyPos.y / PhysicsParameters.SCALAR
    this._angle = this.body.GetAngle()

    const nonSynchronized = super.update(deltaTime)
    if (!this.properties.static) {
      super.updateRenderer(null)
    }
    return nonSynchronized
  }
}
