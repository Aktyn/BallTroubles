import Box2D from '@cocos/box2d'
import { ObjectBase } from '../engine/objects/objectBase'

export abstract class PhysicsWorld extends Box2D.ContactListener {
  readonly world: Box2D.World

  constructor() {
    super()
    const gravity = new Box2D.Vec2(0.0, 0.0)
    this.world = new Box2D.World(gravity)
    // this.world.SetContinuousPhysics(true)

    this.world.SetContactListener(this)
  }

  destroy() {
    let body = this.world.GetBodyList()?.m_next
    while (body) {
      const next = body.m_next
      this.world.DestroyBody(body)
      body = next
    }
  }

  abstract onCollisionStart(objectA: ObjectBase, objectB: ObjectBase): void
  abstract onCollisionEnd(objectA: ObjectBase, objectB: ObjectBase): void

  BeginContact(contact: Box2D.Contact) {
    this.onCollisionStart(
      contact.m_fixtureA.m_userData,
      contact.m_fixtureB.m_userData,
    )
  }

  EndContact(contact: Box2D.Contact) {
    this.onCollisionEnd(
      contact.m_fixtureA.m_userData,
      contact.m_fixtureB.m_userData,
    )
  }

  update(deltaTime: number) {
    this.world.Step(deltaTime, 8, 8)
  }
}
