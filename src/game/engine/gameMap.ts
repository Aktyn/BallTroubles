import { Vector3 } from '../../utils'
import { GUIController } from '../gui'
import { GameCamera } from './camera'
import { Renderable } from './common/renderable'
import { Updatable, updateUpdatables } from './objects/common'
import { ObjectBase } from './objects/objectBase'

export class GameMap {
  private readonly _updatables: Updatable[] = []
  public readonly notSynchronizedRenderables = new Set<Renderable<never>>()
  public readonly camera: GameCamera

  constructor(gui: GUIController) {
    this.camera = new GameCamera(gui, {
      targetPositionOffset: new Vector3(0, -0.8, 1.4),
    })
  }

  destroy() {
    this.camera.destroy()
    for (const updatable of this._updatables) {
      updatable.destroy()
    }
    this.notSynchronizedRenderables.clear()
    this._updatables.length = 0
  }

  get updatables(): readonly Updatable[] {
    return this._updatables
  }

  add(updatable: Updatable) {
    this._updatables.push(updatable)
  }

  // addObject(obj: ObjectBase) {
  //   this._updatables.push(obj)
  // }

  // addEmitter(emitter: EmitterBase) {
  //   this._updatables.push(emitter)
  // }

  // addLight(light: LightSource) {
  //   this._updatables.push(light)
  // }

  setCameraTarget(target: ObjectBase) {
    this.camera.setTarget(target)
  }

  update(deltaTime: number) {
    this.camera.update(deltaTime)

    const nonSynchronized = updateUpdatables(this._updatables, deltaTime)
    for (const renderable of nonSynchronized) {
      this.notSynchronizedRenderables.add(renderable)
    }
  }
}
