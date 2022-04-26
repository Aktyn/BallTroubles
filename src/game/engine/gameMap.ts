import { Vector3 } from '../../utils'
import { GUIController } from '../gui'
import { GameCamera } from './camera'
import { Renderable } from './common/renderable'
import { EmitterBase } from './emitters/emitterBase'
import { LightSource } from './lights/lightSource'
import { Updatable, updateUpdatables } from './objects/common'
import { ObjectBase } from './objects/objectBase'

export class GameMap {
  private readonly _updatables: Updatable[] = []
  private readonly _notSynchronizedRenderables: Renderable<never>[] = []
  public readonly camera: GameCamera

  constructor(gui: GUIController) {
    this.camera = new GameCamera(gui, {
      targetPositionOffset: new Vector3(0, -0.5, 1),
    })
  }

  destroy() {
    this.camera.destroy()
    for (const updatable of this._updatables) {
      updatable.destroy()
    }
    this._notSynchronizedRenderables.length = 0
    this._updatables.length = 0
  }

  get notSynchronizedRenderables(): readonly Renderable<never>[] {
    return this._notSynchronizedRenderables
  }

  get updatables(): readonly Updatable[] {
    return this._updatables
  }

  onRenderablesSynchronized() {
    this._notSynchronizedRenderables.length = 0
  }

  addObject(obj: ObjectBase) {
    this._updatables.push(obj)
    if (!obj.isSynchronizedWithRenderer()) {
      this._notSynchronizedRenderables.push(obj)
    }
  }

  addEmitter(emitter: EmitterBase) {
    this._updatables.push(emitter)
    if (!emitter.isSynchronizedWithRenderer()) {
      this._notSynchronizedRenderables.push(emitter)
    }
  }

  addLight(light: LightSource) {
    this._updatables.push(light)
    if (!light.isSynchronizedWithRenderer()) {
      this._notSynchronizedRenderables.push(light)
    }
  }

  setCameraTarget(target: ObjectBase) {
    this.camera.setTarget(target)
  }

  update(deltaTime: number) {
    this.camera.update(deltaTime)

    updateUpdatables(this._updatables, deltaTime)
  }
}
