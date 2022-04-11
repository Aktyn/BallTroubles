import { PerspectiveCamera } from './camera'
import { ObjectBase } from './objects/objectBase'

export class GameMap {
  private readonly _objects: ObjectBase[] = []
  public readonly camera: PerspectiveCamera

  constructor() {
    this.camera = new PerspectiveCamera(window.innerWidth / window.innerHeight)
  }

  get objects(): Readonly<ObjectBase[]> {
    return this._objects
  }

  addObject(obj: ObjectBase) {
    this._objects.push(obj)
  }

  update(deltaTime: number) {
    const aspectRatio = window.innerWidth / window.innerHeight
    if (this.camera.aspectRatio !== aspectRatio) {
      this.camera.setAspectRatio(aspectRatio)
      this.camera.update() //!
    }

    // this.camera.position.add(0, 0.04 * deltaTime)
    // this.camera.zoom -= 0.04 * deltaTime

    // this.camera.update() //!

    for (const obj of this._objects) {
      obj.update(deltaTime)
    }
  }
}
