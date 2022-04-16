import { randomFloat, Vector3 } from '../../utils'
import { StarsEmitter } from '../engine/emitters/starsEmitter'
import { SunLight } from '../engine/lights/sunLight'
import {
  OBJECT_TYPE,
  OBJECT_MATERIAL,
  BACKGROUND_TEXTURE,
} from '../engine/objects/common'
import { DynamicObject } from '../engine/objects/dynamicObject'
import { MapGenerator } from './common'

export const generateTutorialMap: MapGenerator = (engine, renderer) => {
  // Prepare renderer
  renderer.setupEnvironment({
    color: 0x063040, //average color of background texture
    ambientLight: {
      intensity: 1,
    },
    fog: {
      near: 0.5,
      far: 3,
    },
    backgroundTexture: BACKGROUND_TEXTURE.NEBULA_1,
  })

  // Temp wall
  for (let x = -10; x <= 10; x++) {
    for (let y = -10; y <= 10; y++) {
      if (x !== -10 && x !== 10 && y !== -10 && y !== 10) {
        continue
      }
      const wallObj = new DynamicObject(
        new Vector3(x / 10, y / 10, 0),
        engine.world,
        {
          static: true,
          friction: 1,
          restitution: 1,
          type: OBJECT_TYPE.BOX,
          material: OBJECT_MATERIAL.WOODEN_CRATE,
        },
      )
      engine.map.addObject(wallObj)
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
      engine.world,
      {
        type: OBJECT_TYPE.SMALL_BALL,
        material: OBJECT_MATERIAL.ENEMY_BALL,
        friction: 1,
      },
    )
    obj.setAngle(randomFloat(-Math.PI * 2, Math.PI * 2))
    obj.setLinearVelocity(randomFloat(0, 0.5))

    engine.map.addObject(obj)
  }

  // Particles test
  engine.map.addEmitter(
    new StarsEmitter({
      xRotationSpeed: 1,
      yRotationSpeed: 2,
      zRotationSpeed: 3,
    }),
  )
  engine.map.addEmitter(
    new StarsEmitter({
      xRotationSpeed: -1,
      yRotationSpeed: -2,
      zRotationSpeed: -3,
    }),
  )
  engine.map.addEmitter(
    new StarsEmitter({
      xRotationSpeed: 3,
      yRotationSpeed: 2,
      zRotationSpeed: 1,
    }),
  )
  engine.map.addEmitter(
    new StarsEmitter({
      xRotationSpeed: -3,
      yRotationSpeed: -2,
      zRotationSpeed: -1,
    }),
  )

  // Setup lights
  const sun = new SunLight(new Vector3(1, 1, 2))
  engine.map.addLight(sun)
}
