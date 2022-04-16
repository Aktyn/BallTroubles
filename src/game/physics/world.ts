import Box2D from '@cocos/box2d'

export class PhysicsWorld {
  readonly world: Box2D.World

  constructor() {
    const gravity = new Box2D.Vec2(0.0, 0.0)
    this.world = new Box2D.World(gravity)
    // this.world.SetContinuousPhysics(true)
  }

  destroy() {
    let body = this.world.GetBodyList()?.m_next
    while (body) {
      const next = body.m_next
      this.world.DestroyBody(body)
      body = next
    }
  }

  update(deltaTime: number) {
    this.world.Step(deltaTime, 8, 8)
  }
}
