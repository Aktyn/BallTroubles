import { Matrix4x4, Vector2, XY } from 'utils'

export abstract class ObjectBase {
  private readonly modelViewMatrix: Matrix4x4
  protected _pos: Vector2
  protected _scale: Vector2
  protected _angle = 0

  constructor(pos: XY | Vector2, scale: XY = new Vector2(0.1, 0.1)) {
    this._pos = new Vector2(pos.x, pos.y)
    this._scale = new Vector2(scale.x, scale.y)
    this.modelViewMatrix = new Matrix4x4()
    this.updateMatrix()
  }

  get buffer() {
    return this.modelViewMatrix.buffer
  }

  protected updateMatrix() {
    this.modelViewMatrix.setRotationTranslationScale2D(
      this._angle,
      this._pos,
      this._scale,
    )
  }

  abstract update(deltaTime: number): void
}
