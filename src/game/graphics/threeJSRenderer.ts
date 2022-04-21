import * as THREE from 'three'
import { Renderable } from '../engine/common/renderable'
import { EmitterBase } from '../engine/emitters/emitterBase'
import { GameMap } from '../engine/gameMap'
import { LightSource } from '../engine/lights/lightSource'
import { ObjectBase } from '../engine/objects/objectBase'
import { ThreeJSParticleSystem } from './particles/ThreeJSParticleSystem'
import { EnvironmentOptions, Renderer } from './renderer'
import { ThreeJSResources } from './threeJSResources'

export class ThreeJSRenderer extends Renderer {
  private readonly internalRenderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly threeJSParticleSystems: ThreeJSParticleSystem[] = []

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.canvas.width / this.canvas.height,
      0.01,
      10,
    )

    this.scene = new THREE.Scene()

    this.internalRenderer = new THREE.WebGLRenderer({
      canvas,
      // antialias: true,
      alpha: false,
      premultipliedAlpha: false,
      // depth: false,
      // stencil: false,
      powerPreference: 'high-performance',
      precision: 'lowp',
    })
    this.internalRenderer.pixelRatio = 1 //TODO: test it on mobile
    // this.internalRenderer.shadowMap.enabled = true
    // this.internalRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.internalRenderer.sortObjects = false

    // this.internalRenderer.physicallyCorrectLights = true
    this.internalRenderer.outputEncoding = THREE.sRGBEncoding
  }

  protected onResize() {
    this.camera.aspect = this.canvas.width / this.canvas.height
    this.camera.updateProjectionMatrix()
    this.internalRenderer.setViewport(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    )
    for (const particleSystem of this.threeJSParticleSystems) {
      particleSystem.setCanvasHeight(this.canvas.height)
    }
  }

  setupEnvironment(options: Partial<EnvironmentOptions>) {
    const atmosphereColor = new THREE.Color(options.color ?? 0xffffff)
    if (options.ambientLight) {
      const ambientLight = new THREE.AmbientLight(
        options.ambientLight.color ?? atmosphereColor,
        options.ambientLight.intensity ?? 1,
      )
      this.scene.add(ambientLight)
    }
    if (options.fog) {
      this.scene.fog = new THREE.Fog(
        options.fog.color ?? atmosphereColor,
        options.fog.near ?? 0.5,
        options.fog.far ?? 2,
      )
    }
    if (options.backgroundTexture !== undefined) {
      this.scene.background = ThreeJSResources.getBackgroundTexture(
        options.backgroundTexture,
      )
    } else if (options.backgroundColor) {
      this.scene.background = new THREE.Color(options.backgroundColor)
    }
  }

  private synchronizeMesh(mesh: THREE.Mesh, obj: ObjectBase) {
    mesh.rotation.z = obj.angle
    mesh.position.set(obj.position.x, obj.position.y, obj.position.z)
    mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z)
    if (!mesh.matrixAutoUpdate) {
      mesh.updateMatrix()
    }
  }

  private synchronizeObject(obj: ObjectBase) {
    // Skip non renderable objects
    if (obj.properties.material === undefined) {
      return
    }

    const mesh = new THREE.Mesh(
      ThreeJSResources.getGeometry(obj.properties.type),
      ThreeJSResources.getMaterial(obj.properties.material),
    )
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.matrixAutoUpdate = !obj.properties.static
    this.synchronizeMesh(mesh, obj)

    this.scene.add(mesh)

    obj.synchronizeWithRenderer({
      onUpdate: () => this.synchronizeMesh(mesh, obj),
      onRemoved: () => {
        this.scene.remove(mesh)
      },
    })
  }

  private synchronizeEmitter(emitter: EmitterBase) {
    const particleSystem = new ThreeJSParticleSystem(
      emitter,
      this.canvas.height,
      emitter.properties.frustumCulled,
    )
    particleSystem.setCameraZoom(this.camera.zoom)
    this.threeJSParticleSystems.push(particleSystem)
    this.scene.add(particleSystem.getThreeJSObject())

    emitter.synchronizeWithRenderer({
      onUpdate: (data) => particleSystem.update(data),
      onRemoved: () => {
        particleSystem.destroy()
        this.scene.remove(particleSystem.getThreeJSObject())
        try {
          this.threeJSParticleSystems.splice(
            this.threeJSParticleSystems.indexOf(particleSystem),
            1,
          )
        } catch (e) {
          console.error(e)
        }
      },
    })
  }

  private updateLightSource(
    light: LightSource,
    threeJSLight: THREE.Light,
    targetObject: THREE.Object3D,
  ) {
    threeJSLight.position.set(
      light.position.x,
      light.position.y,
      light.position.z,
    )

    targetObject.position.set(
      light.targetPosition.x,
      light.targetPosition.y,
      light.targetPosition.z,
    )

    const colorHex =
      ((light.color.x * 255) << 16) |
      ((light.color.y * 255) << 8) |
      (light.color.z * 255)
    threeJSLight.color.set(colorHex)
  }

  private synchronizeLight(light: LightSource) {
    //TODO: allow more light types
    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color(0xffffff).convertSRGBToLinear(),
      5,
    )
    // directionalLight.position.set(1, 1, 2)
    // directionalLight.lookAt(0, 0, 0)

    // directionalLight.castShadow = true
    // directionalLight.shadow.mapSize.width = 1024
    // directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 5

    const targetObject = new THREE.Object3D()
    this.scene.add(targetObject)
    directionalLight.target = targetObject

    this.updateLightSource(light, directionalLight, targetObject)
    this.scene.add(directionalLight)

    light.synchronizeWithRenderer({
      onUpdate: () =>
        this.updateLightSource(light, directionalLight, targetObject),
      onRemoved: () => {
        directionalLight.dispose()
        this.scene.remove(directionalLight)
        this.scene.remove(targetObject)
      },
    })
  }

  private synchronizeRenderableObjects(
    renderables: readonly Renderable<never>[],
  ) {
    for (const renderable of renderables) {
      if (renderable instanceof EmitterBase) {
        this.synchronizeEmitter(renderable)
      } else if (renderable instanceof LightSource) {
        this.synchronizeLight(renderable)
      } else if (renderable instanceof ObjectBase) {
        this.synchronizeObject(renderable)
      }
      if (renderable instanceof ObjectBase && renderable.children.length) {
        this.synchronizeRenderableObjects(
          (renderable.children as unknown[]).filter(
            (child) => child instanceof Renderable,
          ) as Renderable<never>[],
        )
      }
    }
  }

  render(map: Readonly<GameMap>) {
    // //NOTE: background particle emitters should be synchronized before regular objects
    // // Synchronize emitters
    // for (const emitter of map.emitters) {
    //   if (!emitter.isSynchronizedWithRenderer()) {
    //     this.synchronizeEmitter(emitter)
    //   }
    // }
    // // Synchronize objects
    // for (const obj of map.objects) {
    //   if (!obj.isSynchronizedWithRenderer()) {
    //     this.synchronizeObject(obj)
    //   }
    // }
    // // Synchronize lights
    // for (const light of map.lights) {
    //   if (!light.isSynchronizedWithRenderer()) {
    //     this.synchronizeLight(light)
    //   }
    // }
    this.synchronizeRenderableObjects(map.notSynchronizedRenderables)
    map.onRenderablesSynchronized()

    // Synchronize camera
    this.camera.position.set(
      map.camera.position.x,
      map.camera.position.y,
      map.camera.position.z,
    )

    this.camera.rotation.set(0, 0, 0)
    this.camera.rotation.x = Math.abs(
      -Math.atan2(
        map.camera.targetPosition.y - map.camera.position.y,
        map.camera.targetPosition.z - map.camera.position.z,
      ) + Math.PI,
    )
    const rotZ = -Math.atan2(
      map.camera.targetPosition.x - map.camera.position.x,
      map.camera.targetPosition.y - map.camera.position.y,
    )
    this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotZ)

    if (this.camera.zoom !== map.camera.visibleZoom) {
      this.camera.zoom = map.camera.visibleZoom
      this.camera.updateProjectionMatrix()
      for (const particleSystem of this.threeJSParticleSystems) {
        particleSystem.setCameraZoom(map.camera.visibleZoom)
      }
    }

    this.internalRenderer.render(this.scene, this.camera)
  }
}
