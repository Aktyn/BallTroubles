import { Vector2 } from '.'
import { XY } from './common'

abstract class MatrixBase {
  protected readonly _buffer: Float32Array
  protected readonly width: number
  protected readonly height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this._buffer = new Float32Array(width * height)
  }

  get buffer() {
    return this._buffer
  }

  setIdentity() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const i = y * this.width + x
        this._buffer[i] = x === y ? 1 : 0
      }
    }
  }

  abstract setPerspectiveNO(
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ): this
  abstract setPerspective(
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ): this
  abstract translate(x: number, y: number, z: number): this
  abstract setTranslation(x: number, y: number, z: number): this
  abstract setScale(x: number, y: number, z: number): this
}

export class Matrix4x4 extends MatrixBase {
  constructor() {
    super(4, 4)
    this.setIdentity()
  }

  setPerspectiveNO(
    fieldOfView: number,
    aspect: number,
    zNear: number,
    zFar: number,
  ) {
    const f = 1.0 / Math.tan(fieldOfView / 2)
    this._buffer[0] = f / aspect
    this._buffer[1] = 0
    this._buffer[2] = 0
    this._buffer[3] = 0
    this._buffer[4] = 0
    this._buffer[5] = f
    this._buffer[6] = 0
    this._buffer[7] = 0
    this._buffer[8] = 0
    this._buffer[9] = 0
    this._buffer[11] = -1
    this._buffer[12] = 0
    this._buffer[13] = 0
    this._buffer[15] = 0
    if (zFar != null && zFar !== Infinity) {
      const nf = 1 / (zNear - zFar)
      this._buffer[10] = (zFar + zNear) * nf
      this._buffer[14] = 2 * zFar * zNear * nf
    } else {
      this._buffer[10] = -1
      this._buffer[14] = -2 * zNear
    }

    return this
  }

  setPerspective(
    fieldOfView: number,
    aspect: number,
    zNear: number,
    zFar: number,
  ) {
    return this.setPerspectiveNO(fieldOfView, aspect, zNear, zFar)
  }

  translate(x: number, y: number, z: number) {
    this._buffer[12] =
      this._buffer[0] * x +
      this._buffer[4] * y +
      this._buffer[8] * z +
      this._buffer[12]
    this._buffer[13] =
      this._buffer[1] * x +
      this._buffer[5] * y +
      this._buffer[9] * z +
      this._buffer[13]
    this._buffer[14] =
      this._buffer[2] * x +
      this._buffer[6] * y +
      this._buffer[10] * z +
      this._buffer[14]
    this._buffer[15] =
      this._buffer[3] * x +
      this._buffer[7] * y +
      this._buffer[11] * z +
      this._buffer[15]

    return this
  }

  setTranslation(x: number, y: number, z: number) {
    this.translate(
      x - this._buffer[12],
      y - this._buffer[13],
      z - this._buffer[14],
    )
    return this
  }

  setScale(x: number, y: number, z: number) {
    this._buffer[0] = x
    this._buffer[5] = y
    this._buffer[10] = z
    return this
  }

  setRotationTranslationScale2D(
    rotationZ: number,
    position: XY | Vector2,
    scale: XY | Vector2,
  ) {
    const rad = rotationZ * 0.5
    const s = Math.sin(rad)
    const z = s
    const w = Math.cos(rad)

    const z2 = z + z

    const zz = z * z2
    const wz = w * z2
    const sx = scale.x
    const sy = scale.y

    this._buffer[0] = (1 - zz) * sx
    this._buffer[1] = wz * sx
    this._buffer[2] = 0
    this._buffer[3] = 0
    this._buffer[4] = -wz * sy
    this._buffer[5] = (1 - zz) * sy
    this._buffer[6] = 0
    this._buffer[7] = 0
    this._buffer[8] = 0
    this._buffer[9] = 0
    this._buffer[10] = 1
    this._buffer[11] = 0
    this._buffer[12] = position.x
    this._buffer[13] = position.y
    this._buffer[14] = 0
    this._buffer[15] = 1

    return this
  }
}
