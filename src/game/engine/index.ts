import { b2BodyType } from 'game/physics/utils'
import { PhysicsWorld } from 'game/physics/world'
import { randomFloat } from 'utils'
import { GameMap } from './gameMap'
import { DynamicObject } from './objects/dynamicObject'

export class GameEngine extends PhysicsWorld {
  private readonly map = new GameMap()

  constructor() {
    super()

    // Temp wall
    for (let x = -10; x <= 10; x++) {
      for (let y = -10; y <= 10; y++) {
        if (x !== -10 && x !== 10 && y !== -10 && y !== 10) {
          continue
        }
        const wallObj = new DynamicObject(
          { x: x / 10, y: y / 10 },
          { x: 0.05, y: 0.05 },
          this.world,
          {
            bodyType: b2BodyType.b2_staticBody,
            friction: 0,
            restitution: 0,
          },
        )
        // wallObj.s
        this.map.addObject(wallObj)
      }
    }

    // Some dummy objects for tests
    for (let i = 0; i < 100; i++) {
      const obj = new DynamicObject(
        {
          x: randomFloat(-0.9, 0.9),
          y: randomFloat(-0.9, 0.9),
        },
        { x: 0.025, y: 0.025 },
        this.world,
      )
      obj.angle = randomFloat(-Math.PI * 2, Math.PI * 2)
      obj.speed = randomFloat(3, 10)

      this.map.addObject(obj)
    }
  }

  getMap(): Readonly<GameMap> {
    return this.map
  }

  update(deltaTime: number) {
    super.update(deltaTime)
    this.map.update(deltaTime)
  }
}
