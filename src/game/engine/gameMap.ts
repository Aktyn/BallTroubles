import { Vector3 } from '../../utils'
import { GUIController } from '../gui'
import { GameCamera } from './camera'
import { EmitterBase } from './emitters/emitterBase'
import { LightSource } from './lights/lightSource'
import { ObjectBase } from './objects/objectBase'

export class GameMap {
  private readonly _objects: ObjectBase[] = []
  private readonly _emitters: EmitterBase[] = []
  private readonly _lights: LightSource[] = []
  public readonly camera: GameCamera

  constructor(gui: GUIController) {
    this.camera = new GameCamera(gui, {
      targetPositionOffset: new Vector3(0, -0.5, 1),
    })
  }

  destroy() {
    this.camera.destroy()
    for (const obj of this._objects) {
      obj.destroy()
      this._objects.length = 0
    }
    for (const emitter of this._emitters) {
      emitter.destroy()
      this._emitters.length = 0
    }
  }

  get objects(): Readonly<ObjectBase[]> {
    return this._objects
  }

  get emitters(): Readonly<EmitterBase[]> {
    return this._emitters
  }

  get lights(): Readonly<LightSource[]> {
    return this._lights
  }

  addObject(obj: ObjectBase) {
    this._objects.push(obj)
  }

  addEmitter(emitter: EmitterBase) {
    this._emitters.push(emitter)
  }

  addLight(light: LightSource) {
    this._lights.push(light)
  }

  setCameraTarget(target: ObjectBase) {
    this.camera.setTarget(target.position)
  }

  update(deltaTime: number) {
    this.camera.update(deltaTime)

    for (const updatableObjects of [
      this._objects,
      this._emitters,
      this._lights,
    ]) {
      for (let i = 0; i < updatableObjects.length; i++) {
        const obj = updatableObjects[i]
        if (obj.destroyed) {
          updatableObjects.splice(i, 1)
          i--
        } else {
          obj.update(deltaTime)
        }
      }
    }
  }
}
