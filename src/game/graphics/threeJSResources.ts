/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from 'three'
import palette from '../../style/palette.json'
import { OBJECT_MATERIAL, OBJECT_TYPE } from '../engine/objects/common'
import { Resources } from './../resources'

const textureLoader = new THREE.TextureLoader()

function setupColorTexture(texture: THREE.Texture) {
  texture.encoding = THREE.sRGBEncoding
  // texture.wrapS = THREE.RepeatWrapping
  // texture.wrapT = THREE.RepeatWrapping
  // texture.repeat.set(4, 4)
  return texture
}

function setupEnvironmentTexture(texture: THREE.Texture) {
  texture.encoding = THREE.sRGBEncoding
  texture.mapping = THREE.EquirectangularReflectionMapping
  return texture
}

//TODO: load only when needed, dispose after game ends
const ThreeJSTextures = {
  particle: {
    star: setupColorTexture(
      textureLoader.load(
        require('assets/textures/particles/star_particle.png'),
      ),
    ),
  },

  environment: {
    forest: setupEnvironmentTexture(
      textureLoader.load(
        require('assets/textures/environment/je_gray_02_1k.jpg'),
      ),
    ),
  },
  woodCrate: {
    color: setupColorTexture(
      textureLoader.load(
        require('assets/textures/crate/Wood_Crate_001_basecolor.jpg'),
      ),
    ),
    normal: textureLoader.load(
      require('assets/textures/crate/Wood_Crate_001_normal.jpg'),
    ),
    specular: textureLoader.load(
      require('assets/textures/crate/Wood_Crate_001_roughness.jpg'),
    ),
  },
  redEnemy: {
    color: setupColorTexture(
      textureLoader.load(require('assets/textures/red_enemy/enemy.png')),
    ),
  },
}

const BoxGeometry = new THREE.BoxBufferGeometry(1, 1, 1) //BoxBufferGeometry
const SphereGeometry = new THREE.IcosahedronBufferGeometry(1, 4) //new THREE.SphereBufferGeometry(1, 16, 16)

const linearWhite = new THREE.Color(palette.white).convertSRGBToLinear()

const geometryLoader = (objectType: OBJECT_TYPE) => {
  switch (objectType) {
    default:
    case OBJECT_TYPE.BOX:
    case OBJECT_TYPE.GROUND_BOX:
      return BoxGeometry

    case OBJECT_TYPE.SMALL_BALL:
      return SphereGeometry
  }
}

const materialLoader = (materialType: OBJECT_MATERIAL) => {
  switch (materialType) {
    default:
    case OBJECT_MATERIAL.WOODEN_CRATE:
      return new THREE.MeshPhongMaterial({
        color: linearWhite,
        flatShading: true,
        map: ThreeJSTextures.woodCrate.color,
        normalMap: ThreeJSTextures.woodCrate.normal,
        specularMap: ThreeJSTextures.woodCrate.specular,
        specular: new THREE.Color(0x777777).convertSRGBToLinear(),
        envMap: ThreeJSTextures.environment.forest,
        reflectivity: 0.5,
        combine: THREE.AddOperation,
      })

    case OBJECT_MATERIAL.ENEMY_BALL:
      return new THREE.MeshPhongMaterial({
        flatShading: false,
        color: new THREE.Color(palette.red['300']).convertSRGBToLinear(),
        map: ThreeJSTextures.redEnemy.color,
        envMap: ThreeJSTextures.environment.forest,
        reflectivity: 0.5,
        combine: THREE.AddOperation,
      })

    case OBJECT_MATERIAL.STAR_PARTICLE:
      return new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: {
            value: ThreeJSTextures.particle.star,
          },
        },
        vertexShader: Resources.shaders.get('particles').vertex,
        fragmentShader: Resources.shaders.get('particles').fragment,

        blending: THREE.AdditiveBlending,
        depthTest: false, //? Turn to false on Additive blending
        depthWrite: false,
        depthFunc: THREE.NeverDepth,
        transparent: false, // Not needed for additive blending as long as texture background is black
        // alphaTest: 0.1,
        vertexColors: true,
      })
  }
}

const resourceGetter = <KeyType, ValueType>(
  loader: (key: KeyType) => ValueType,
) => {
  const store = new Map<KeyType, ValueType>()

  return (key: KeyType) => {
    if (!store.has(key)) {
      store.set(key, loader(key))
    }
    return store.get(key) as ValueType
  }
}

export const ThreeJSResources: {
  getGeometry: (shape: OBJECT_TYPE) => THREE.BufferGeometry
  getMaterial: (material: OBJECT_MATERIAL) => THREE.Material
} = {
  getGeometry: resourceGetter(geometryLoader),
  getMaterial: resourceGetter(materialLoader),
}