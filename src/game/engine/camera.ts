import { clamp, Matrix4x4, Vector2 } from 'utils'

interface WebGLCameraParams {
  fieldOfView: number
  zNear: number
  zFar: number
}

const MIN_ZOOM = 0.1
const MAX_ZOOM = 2

export class PerspectiveCamera {
  private readonly params: WebGLCameraParams
  private readonly projectionMatrix = new Matrix4x4()
  public readonly position = new Vector2()
  private _zoom = 1.3 //1.2
  private aspect: number

  constructor(aspectRatio: number, params: Partial<WebGLCameraParams> = {}) {
    this.params = {
      fieldOfView: params.fieldOfView ?? Math.PI * 0.5, // 90 degrees (was 45 by default)
      zNear: params.zNear ?? 0.1,
      zFar: params.zFar ?? 10,
    }
    this.aspect = aspectRatio

    this.update()
  }

  get buffer() {
    return this.projectionMatrix.buffer
  }

  get aspectRatio() {
    return this.aspect
  }

  /** Camera need to be updated for aspect ration change to take effect */
  setAspectRatio(aspect: number) {
    this.aspect = aspect
  }

  get zoom() {
    return this._zoom
  }

  set zoom(value: number) {
    this._zoom = clamp(value, MIN_ZOOM, MAX_ZOOM)
  }

  update() {
    this.projectionMatrix.setPerspective(
      this.params.fieldOfView,
      this.aspect,
      this.params.zNear,
      this.params.zFar,
    )
    this.projectionMatrix.setTranslation(
      this.position.x,
      this.position.y,
      -this._zoom,
    )
  }
}
