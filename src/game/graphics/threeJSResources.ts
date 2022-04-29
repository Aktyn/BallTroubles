/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from 'three'
import palette from '../../style/palette.json'
import {
  BACKGROUND_TEXTURE,
  OBJECT_MATERIAL,
  OBJECT_TYPE,
  SPRITE_MATERIAL,
} from '../engine/objects/common'
import { Resources } from '../resources'
import { OBJLoader } from './loaders/OBJLoader'

const textureLoader = new THREE.TextureLoader()
const objLoader = new OBJLoader()

function setupColorTexture(texture: THREE.Texture) {
  texture.encoding = THREE.sRGBEncoding
  // texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  // texture.repeat.set(4, 4)
  return texture
}

function setupEnvironmentTexture(texture: THREE.Texture) {
  texture.encoding = THREE.sRGBEncoding
  texture.mapping = THREE.EquirectangularReflectionMapping
  return texture
}

const ThreeJSTextures = {
  particle: {
    simple: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/particles/simple_particle.jpg'),
      ),
    ),
    star: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/particles/star_particle.png'),
      ),
    ),
    fire: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/particles/fire_particle.png'),
      ),
    ),
    heal: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/particles/heal_particle.png'),
      ),
    ),
  },

  environment: {
    nebula1: setupEnvironmentTexture(
      textureLoader.load(require('../../assets/textures/background/1.jpg')),
    ),
  },
  woodCrate: {
    color: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/crate/Wood_Crate_001_basecolor.jpg'),
      ),
    ),
    normal: textureLoader.load(
      require('../../assets/textures/crate/Wood_Crate_001_normal.jpg'),
    ),
    specular: textureLoader.load(
      require('../../assets/textures/crate/Wood_Crate_001_roughness.jpg'),
    ),
  },
  enemy: {
    rock: {
      color: setupColorTexture(
        textureLoader.load(
          require('../../assets/textures/enemy/rock/color.png'),
        ),
      ),
      normal: textureLoader.load(
        require('../../assets/textures/enemy/rock/normal.png'),
      ),
      roughness: textureLoader.load(
        require('../../assets/textures/enemy/rock/roughness.png'),
      ),
    },
  },
  player: {
    color: setupColorTexture(
      textureLoader.load(require('../../assets/textures/player/player.png')),
    ),
  },
  gun1: {
    color: setupColorTexture(
      textureLoader.load(
        require('../../assets/textures/effects/gun1Color.jpg'),
      ),
    ),
  },
}

const linearWhite = new THREE.Color(palette.white).convertSRGBToLinear()

const fallbackGeometry = new THREE.BoxBufferGeometry(1, 1, 1)

const loadGeometryFromObjFile = async (filePath: string) => {
  const obj = await objLoader.loadAsync(filePath)
  return obj.children[0].geometry as THREE.BufferGeometry
}

const geometryLoader = async (objectType: OBJECT_TYPE) => {
  try {
    switch (objectType) {
      default:
      case OBJECT_TYPE.BOX:
        return new THREE.BoxBufferGeometry(1, 1, 1)
      case OBJECT_TYPE.SMALL_BALL:
        return new THREE.IcosahedronBufferGeometry(1, 4) //new THREE.SphereBufferGeometry(1, 16, 16)
      case OBJECT_TYPE.HEAL_PLUS:
        return await loadGeometryFromObjFile(
          require('../../assets/meshes/plus.obj'),
        )
      case OBJECT_TYPE.GUN1:
        return await loadGeometryFromObjFile(
          require('../../assets/meshes/gun.obj'),
        )
      case OBJECT_TYPE.SIMPLE_BULLET:
        return await loadGeometryFromObjFile(
          require('../../assets/meshes/bullet.obj'),
        )
    }
  } catch (e) {
    console.error(e)
    return fallbackGeometry
  }
}

const getDefaultParticleMaterialProperties =
  (): THREE.ShaderMaterialParameters => ({
    vertexShader: Resources.shaders.get('particles').vertex,
    fragmentShader: Resources.shaders.get('particles').fragment,

    blending: THREE.AdditiveBlending,
    depthTest: false, //? Turn to false on Additive blending
    depthWrite: false,
    depthFunc: THREE.NeverDepth,
    transparent: false, // Not needed for additive blending as long as texture background is black
    vertexColors: true,
  })

const materialLoader = async <
  MaterialType extends OBJECT_MATERIAL | SPRITE_MATERIAL,
>(
  materialType: MaterialType,
) => {
  switch (materialType) {
    default:
      throw new Error(`Material type is not supported: ${materialType}`)
    case OBJECT_MATERIAL.WOODEN_CRATE:
      return new THREE.MeshPhongMaterial({
        color: linearWhite,
        flatShading: true,
        map: ThreeJSTextures.woodCrate.color,
        normalMap: ThreeJSTextures.woodCrate.normal,
        specularMap: ThreeJSTextures.woodCrate.specular,
        specular: linearWhite, //new THREE.Color(0x777777).convertSRGBToLinear(),
        envMap: ThreeJSTextures.environment.nebula1,
        reflectivity: 0.5,
        combine: THREE.AddOperation,
      })

    case OBJECT_MATERIAL.ROCK_ENEMY:
      return new THREE.MeshStandardMaterial({
        flatShading: false,
        color: linearWhite,
        map: ThreeJSTextures.enemy.rock.color,
        normalMap: ThreeJSTextures.enemy.rock.normal,
        metalness: 0,
        roughnessMap: ThreeJSTextures.enemy.rock.roughness,
      })
    case OBJECT_MATERIAL.PLAYER:
      return new THREE.MeshStandardMaterial({
        flatShading: false,
        color: new THREE.Color(
          palette['deep-orange']['900'],
        ).convertSRGBToLinear(),
        // color: new THREE.Color('#000').convertSRGBToLinear(),
        // map: ThreeJSTextures.player.color,
        emissiveMap: ThreeJSTextures.player.color,
        emissive: new THREE.Color(
          palette['deep-orange']['800'],
        ).convertSRGBToLinear(),
        emissiveIntensity: 1.5,
        metalness: 1,
        roughness: 0.3,
      })
    case OBJECT_MATERIAL.HEAL_PLUS:
      return new THREE.MeshStandardMaterial({
        flatShading: true,
        color: new THREE.Color(
          palette['light-green']['300'],
        ).convertSRGBToLinear(),
        emissive: new THREE.Color(palette.green['600']).convertSRGBToLinear(),
        emissiveIntensity: 3,
      })
    case OBJECT_MATERIAL.GUN1:
      return new THREE.MeshStandardMaterial({
        flatShading: false,
        color: linearWhite,
        map: ThreeJSTextures.gun1.color,
        metalness: 1,
        roughness: 0.3,
      })
    case OBJECT_MATERIAL.SIMPLE_BULLET:
      return new THREE.MeshStandardMaterial({
        flatShading: false,
        color: new THREE.Color(palette.red['400']).convertSRGBToLinear(),
        envMap: ThreeJSTextures.environment.nebula1,
        envMapIntensity: 2,
        metalness: 1,
        roughness: 0.1,
      })

    /** PARTICLE MATERIALS **/
    case OBJECT_MATERIAL.SIMPLE_PARTICLE:
      return new THREE.ShaderMaterial({
        ...getDefaultParticleMaterialProperties(),
        uniforms: {
          pointTexture: {
            value: ThreeJSTextures.particle.simple,
          },
        },
      })
    case OBJECT_MATERIAL.STAR_PARTICLE:
      return new THREE.ShaderMaterial({
        ...getDefaultParticleMaterialProperties(),
        uniforms: {
          pointTexture: {
            value: ThreeJSTextures.particle.star,
          },
        },
        depthTest: true,
      })
    case OBJECT_MATERIAL.FIRE_PARTICLE:
      return new THREE.ShaderMaterial({
        ...getDefaultParticleMaterialProperties(),
        uniforms: {
          pointTexture: {
            value: ThreeJSTextures.particle.fire,
          },
        },
        depthTest: true,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })
    case OBJECT_MATERIAL.HEAL_PARTICLE:
      return new THREE.ShaderMaterial({
        ...getDefaultParticleMaterialProperties(),
        uniforms: {
          pointTexture: {
            value: ThreeJSTextures.particle.heal,
          },
        },
        depthTest: true,
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

    /** SPRITE MATERIALS */
    case SPRITE_MATERIAL.HEALTH_BAR:
      return new THREE.SpriteMaterial({
        // color: new THREE.Color(palette.red['500']).convertSRGBToLinear(),
        transparent: false,
      })
  }
}

const backgroundTextureGetter = (texture: BACKGROUND_TEXTURE) => {
  switch (texture) {
    default:
    case BACKGROUND_TEXTURE.NEBULA_1:
      return ThreeJSTextures.environment.nebula1
  }
}

const resourceGetter = <KeyType, ValueType>(
  loader: (key: KeyType) => Promise<ValueType>,
) => {
  const store = new Map<KeyType, ValueType>()

  return async (key: KeyType) => {
    if (!store.has(key)) {
      try {
        store.set(key, await loader(key))
      } catch (e) {
        console.error(e)
        store.set(key, null as never)
      }
    }
    return store.get(key) as ValueType
  }
}

export const ThreeJSResources: {
  getBackgroundTexture: typeof backgroundTextureGetter
  getGeometry: (shape: OBJECT_TYPE) => Promise<THREE.BufferGeometry>
  getMaterial: <MaterialType extends OBJECT_MATERIAL | SPRITE_MATERIAL>(
    material: MaterialType,
  ) => Promise<
    MaterialType extends OBJECT_MATERIAL ? THREE.Material : THREE.SpriteMaterial
  >
} = {
  getBackgroundTexture: backgroundTextureGetter,
  getGeometry: resourceGetter(geometryLoader),
  getMaterial: resourceGetter(materialLoader) as never,
}
