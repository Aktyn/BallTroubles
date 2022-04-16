import * as THREE from 'three'
import { EmitterBase } from '../engine/emitters/emitterBase'
import { GameMap } from '../engine/gameMap'
import { ObjectBase } from '../engine/objects/objectBase'
import { ThreeJSParticleSystem } from './particles/ThreeJSParticleSystem'
import { Renderer } from './renderer'
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

    //TODO: synchronize map lights
    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color(0xffffff).convertSRGBToLinear(),
      10,
    )
    directionalLight.position.set(1, 1, 2)
    directionalLight.lookAt(0, 0, 0)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 5
    this.scene.add(directionalLight)

    const atmosphereColor = new THREE.Color(0x0d47a1) //.convertLinearToSRGB()
    const ambientLight = new THREE.AmbientLight(atmosphereColor, 1)
    this.scene.add(ambientLight)
    this.scene.fog = new THREE.Fog(atmosphereColor, 0.5, 3)
    this.scene.background = atmosphereColor

    this.internalRenderer = new THREE.WebGLRenderer({
      canvas,
      // antialias: true,
      alpha: false,
      premultipliedAlpha: false,
      depth: false,
      // stencil: false,
      powerPreference: 'high-performance',
      precision: 'lowp',
    })
    this.internalRenderer.pixelRatio = 1 //TODO: test it on mobile
    this.internalRenderer.shadowMap.enabled = true
    this.internalRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.internalRenderer.sortObjects = false

    this.internalRenderer.physicallyCorrectLights = true
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

  private synchronizeMesh(mesh: THREE.Mesh, obj: ObjectBase) {
    mesh.rotation.z = obj.angle
    mesh.position.set(obj.pos.x, obj.pos.y, obj.pos.z)
    mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z)
    if (!mesh.matrixAutoUpdate) {
      mesh.updateMatrix()
    }
  }

  private synchronizeObject(obj: ObjectBase) {
    const mesh = new THREE.Mesh(
      ThreeJSResources.getGeometry(obj.properties.shape),
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

  render(map: Readonly<GameMap>) {
    //NOTE: background particle emitters should be synchronized before regular objects
    // Synchronize emitters
    for (const emitter of map.emitters) {
      if (!emitter.isSynchronizedWithRenderer()) {
        this.synchronizeEmitter(emitter)
      }
    }
    // Synchronize objects
    for (const obj of map.objects) {
      if (!obj.isSynchronizedWithRenderer()) {
        this.synchronizeObject(obj)
      }
    }

    // Synchronize camera
    this.camera.position.set(
      map.camera.position.x,
      map.camera.position.y,
      map.camera.position.z,
    )
    this.camera.rotation.set(
      map.camera.rotation.x,
      map.camera.rotation.y,
      map.camera.rotation.z,
    )
    if (this.camera.zoom !== map.camera.visibleZoom) {
      this.camera.zoom = map.camera.visibleZoom
      this.camera.updateProjectionMatrix()
      for (const particleSystem of this.threeJSParticleSystems) {
        particleSystem.setCameraZoom(map.camera.visibleZoom)
      }
    }
    // this.camera.lookAt(0, 0, 0)

    this.internalRenderer.render(this.scene, this.camera)
  }
}
