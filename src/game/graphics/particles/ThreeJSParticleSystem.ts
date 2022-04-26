import * as THREE from 'three'
import {
  EmitterBase,
  RendererUpdateData,
} from '../../engine/emitters/emitterBase'

export class ThreeJSParticleSystem {
  private readonly emitter: EmitterBase
  private readonly particleSystem: THREE.Points

  private readonly cameraZoomBuffer: THREE.InstancedBufferAttribute
  private readonly canvasHeightBuffer: THREE.InstancedBufferAttribute

  private readonly positionBuffer: THREE.Float32BufferAttribute
  private readonly sizeBuffer: THREE.Float32BufferAttribute
  private readonly colorBuffer: THREE.Float32BufferAttribute

  constructor(
    emitter: EmitterBase,
    threeMaterial: THREE.Material,
    canvasHeight: number,
    frustumCulled: boolean,
  ) {
    this.emitter = emitter

    const geometry = new THREE.BufferGeometry()

    this.particleSystem = new THREE.Points(geometry, threeMaterial)
    this.particleSystem.frustumCulled = frustumCulled

    this.positionBuffer = new THREE.Float32BufferAttribute(
      this.emitter.positionBuffer,
      3,
    ).setUsage(THREE.DynamicDrawUsage)
    this.positionBuffer.array = this.emitter.positionBuffer
    this.particleSystem.geometry.setAttribute('position', this.positionBuffer)

    this.sizeBuffer = new THREE.Float32BufferAttribute(
      this.emitter.sizeBuffer,
      1,
    ).setUsage(THREE.DynamicDrawUsage)
    this.sizeBuffer.array = this.emitter.sizeBuffer
    this.particleSystem.geometry.setAttribute('size', this.sizeBuffer)

    this.colorBuffer = new THREE.Float32BufferAttribute(
      this.emitter.colorBuffer,
      3,
    ).setUsage(THREE.DynamicDrawUsage)
    this.colorBuffer.array = this.emitter.colorBuffer
    this.particleSystem.geometry.setAttribute('color', this.colorBuffer)

    this.canvasHeightBuffer = new THREE.InstancedBufferAttribute(
      new Float32Array([canvasHeight]),
      1,
      false,
      this.emitter.properties.particlesCount,
    ).setUsage(THREE.StaticReadUsage)
    this.particleSystem.geometry.setAttribute(
      'canvasHeight',
      this.canvasHeightBuffer,
    )

    this.cameraZoomBuffer = new THREE.InstancedBufferAttribute(
      new Float32Array([1]),
      1,
      false,
      this.emitter.properties.particlesCount,
    ).setUsage(THREE.StaticReadUsage)
    this.particleSystem.geometry.setAttribute('zoom', this.cameraZoomBuffer)
  }

  destroy() {
    this.particleSystem.geometry.dispose()
  }

  getThreeJSObject() {
    return this.particleSystem
  }

  setCameraZoom(zoom: number) {
    this.cameraZoomBuffer.set(new Float32Array([zoom]))
    this.cameraZoomBuffer.needsUpdate = true
  }

  setCanvasHeight(height: number) {
    this.canvasHeightBuffer.set(new Float32Array([height]))
    this.canvasHeightBuffer.needsUpdate = true
  }

  update(data: RendererUpdateData) {
    if (data.updatePositions) {
      this.positionBuffer.needsUpdate = true
    }
    if (data.updateSizes) {
      this.sizeBuffer.needsUpdate = true
    }
    if (data.updateColors) {
      this.colorBuffer.needsUpdate = true
    }
    if (data.updateCenterPosition) {
      this.particleSystem.position.set(
        this.emitter.position.x,
        this.emitter.position.y,
        this.emitter.position.z,
      )
    }
    if (data.updateCenterRotation) {
      this.particleSystem.rotation.set(
        this.emitter.rotation.x,
        this.emitter.rotation.y,
        this.emitter.rotation.z,
      )
    }
  }
}
