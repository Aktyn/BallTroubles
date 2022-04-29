import { randomFloat, Vector3 } from '../../utils'
import { StarsEmitter } from '../engine/emitters/starsEmitter'
import { SunLight } from '../engine/lights/sunLight'
import {
  OBJECT_TYPE,
  OBJECT_MATERIAL,
  BACKGROUND_TEXTURE,
} from '../engine/objects/common'
import { DynamicObject } from '../engine/objects/dynamicObject'
import { GunEffect } from '../engine/objects/effects/gunEffect'
import { HealEffect } from '../engine/objects/effects/healEffect'
import { Portal } from '../engine/objects/portal'
import { RockEnemy } from '../engine/objects/rockEnemy'
import { MapGenerator } from './common'

export const generateTutorialMap: MapGenerator = (engine, renderer) => {
  // Prepare renderer
  renderer.setupEnvironment({
    color: 0x063040, //average color of background texture
    ambientLight: {
      intensity: 1,
    },
    fog: {
      near: 1.5,
      far: 2.5,
    },
    backgroundTexture: BACKGROUND_TEXTURE.NEBULA_1,
  })

  // Background particles (should be added before all objects)
  engine.map.add(
    new StarsEmitter({
      xRotationSpeed: 1,
      yRotationSpeed: 2,
      zRotationSpeed: 3,
    }),
  )
  engine.map.add(
    new StarsEmitter({
      xRotationSpeed: -1,
      yRotationSpeed: -2,
      zRotationSpeed: -3,
    }),
  )
  engine.map.add(
    new StarsEmitter({
      xRotationSpeed: 3,
      yRotationSpeed: 2,
      zRotationSpeed: 1,
    }),
  )
  engine.map.add(
    new StarsEmitter({
      xRotationSpeed: -3,
      yRotationSpeed: -2,
      zRotationSpeed: -1,
    }),
  )

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
      engine.map.add(wallObj)
    }
  }

  // Some dummy objects for tests
  for (let i = 0; i < 10; i++) {
    // Randomly placed enemies
    const obj = new RockEnemy(
      new Vector3(randomFloat(-0.9, 0.9), randomFloat(-0.9, 0.9), 0),
      engine.world,
    )
    obj.setAngle(randomFloat(-Math.PI * 2, Math.PI * 2))
    obj.setLinearVelocity(randomFloat(0, 0.5))
    engine.map.add(obj)
    // obj.shouldBeDeleted = true //!

    //Randomly placed effects
    engine.map.add(
      new HealEffect(
        new Vector3(randomFloat(-0.9, 0.9), randomFloat(-0.9, 0.9), 0),
        engine.world,
      ),
    )
    engine.map.add(
      new GunEffect(
        new Vector3(randomFloat(-0.9, 0.9), randomFloat(-0.9, 0.9), 0),
        engine.world,
      ),
    )
  }

  engine.map.add(new Portal(new Vector3(0.5, 0.5, 0), engine.world, 0))
  engine.map.add(new Portal(new Vector3(-0.5, -0.5, 0), engine.world, 0))

  engine.map.add(new Portal(new Vector3(-0.5, 0.5, 0), engine.world, 1))
  engine.map.add(new Portal(new Vector3(0.5, -0.5, 0), engine.world, 1))

  // Setup lights
  const sun = new SunLight(new Vector3(1, 1, 2))
  engine.map.add(sun)
}
