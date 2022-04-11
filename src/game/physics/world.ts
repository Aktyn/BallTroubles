import Box2D from '@cocos/box2d'

export class PhysicsWorld {
  protected readonly world: Box2D.World

  constructor() {
    const gravity = new Box2D.Vec2(0.0, 0.0)
    this.world = new Box2D.World(gravity)
    // this.world.SetContinuousPhysics(true)
  }

  update(deltaTime: number) {
    this.world.Step(deltaTime, 8, 8)
  }
}
