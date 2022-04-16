import { randomFloat, Vector3 } from '../../utils'
import { GUIController } from '../gui'
import { PhysicsWorld } from '../physics/world'
import { StarsEmitter } from './emitters/starsEmitter'
import { GameMap } from './gameMap'
import { OBJECT_MATERIAL, OBJECT_TYPE } from './objects/common'
import { DynamicObject } from './objects/dynamicObject'

export class GameEngine extends PhysicsWorld {
  private readonly map: GameMap

  constructor(gui: GUIController) {
    super()
    this.map = new GameMap(gui)

    // Temp wall
    for (let x = -10; x <= 10; x++) {
      for (let y = -10; y <= 10; y++) {
        if (x !== -10 && x !== 10 && y !== -10 && y !== 10) {
          continue
        }
        const wallObj = new DynamicObject(
          new Vector3(x / 10, y / 10, 0),
          this.world,
          {
            static: true,
            friction: 0,
            restitution: 0,
            shape: OBJECT_TYPE.BOX,
            material: OBJECT_MATERIAL.WOODEN_CRATE,
          },
        )
        this.map.addObject(wallObj)
      }
    }

    // Floor
    // const floorObj = new GhostObject({
    //   shape: OBJECT_TYPE.GROUND_BOX,
    //   material: OBJECT_MATERIAL.WOODEN_CRATE,
    // })
    // const boxScale = DefaultProperties[OBJECT_TYPE.BOX].scale
    // floorObj.pos.set(0, 0, -boxScale.z)
    // this.map.addObject(floorObj)

    // Some dummy objects for tests
    for (let i = 0; i < 100; i++) {
      const obj = new DynamicObject(
        new Vector3(randomFloat(-0.9, 0.9), randomFloat(-0.9, 0.9), 0),
        this.world,
        {
          shape: OBJECT_TYPE.SMALL_BALL,
          material: OBJECT_MATERIAL.ENEMY_BALL,
          friction: 0.5,
        },
      )
      obj.setAngle(randomFloat(-Math.PI * 2, Math.PI * 2))
      obj.speed = randomFloat(0, 0.5)

      this.map.addObject(obj)
    }

    // Particles test
    this.map.addEmitter(
      new StarsEmitter({
        xRotationSpeed: 1,
        yRotationSpeed: 2,
        zRotationSpeed: 3,
      }),
    )
    this.map.addEmitter(
      new StarsEmitter({
        xRotationSpeed: -1,
        yRotationSpeed: -2,
        zRotationSpeed: -3,
      }),
    )
    this.map.addEmitter(
      new StarsEmitter({
        xRotationSpeed: 3,
        yRotationSpeed: 2,
        zRotationSpeed: 1,
      }),
    )
    this.map.addEmitter(
      new StarsEmitter({
        xRotationSpeed: -3,
        yRotationSpeed: -2,
        zRotationSpeed: -1,
      }),
    )
  }

  destroy() {
    this.map.destroy()
    super.destroy()
  }

  getMap(): Readonly<GameMap> {
    return this.map
  }

  update(deltaTime: number) {
    super.update(deltaTime)
    this.map.update(deltaTime)
  }
}
