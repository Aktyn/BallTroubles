import { GUIController } from '../gui'
import { GameCamera } from './camera'
import { EmitterBase } from './emitters/emitterBase'
import { ObjectBase } from './objects/objectBase'

export class GameMap {
  private readonly _objects: ObjectBase[] = []
  private readonly _emitters: EmitterBase[] = []
  public readonly camera: GameCamera

  constructor(gui: GUIController) {
    this.camera = new GameCamera(gui)
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

  addObject(obj: ObjectBase) {
    this._objects.push(obj)
  }

  addEmitter(emitter: EmitterBase) {
    this._emitters.push(emitter)
  }

  update(deltaTime: number) {
    this.camera.update(deltaTime)

    for (const obj of this._objects) {
      obj.update(deltaTime)
    }
    for (const emitter of this._emitters) {
      emitter.update(deltaTime)
    }
  }
}
