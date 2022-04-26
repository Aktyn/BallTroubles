import { clamp, Vector3 } from '../../utils'
import { GUIController } from '../gui'
import { ObjectBase } from './objects/objectBase'

interface CameraProperties {
  targetPositionOffset: Vector3
}

const vector3Zero = new Vector3(0, 0, 0)

export class GameCamera {
  private static MIN_ZOOM = 0.5
  private static MAX_ZOOM = 4
  private static MINIMUM_ZOOM_DIFFERENCE = 1e-5
  private static ZOOM_SPEED = 8
  private static MOVEMENT_SMOOTHNESS = 6
  private static TARGET_MOVEMENT_SMOOTHNESS = 8

  private readonly eventListeners = {
    onResize: this.handleMouseWheel.bind(this),
    onZoomReset: this.resetZoom.bind(this),
    onZoomIn: this.zoomIn.bind(this),
    onZoomOut: this.zoomOut.bind(this),
    onPauseToggle: this.togglePause.bind(this),
  }

  private readonly gui: GUIController
  private readonly properties: CameraProperties

  public readonly position = new Vector3(0, 0, 0)
  private _target: ObjectBase | null = null
  private visibleTargetPosition = new Vector3(0, 0, 0)
  private _zoom = 1
  private _visibleZoom = 1
  private paused = false

  constructor(gui: GUIController, properties: CameraProperties) {
    this.gui = gui
    this.properties = properties
    this.position.setV(properties.targetPositionOffset)
    this.setupEventListeners()
    gui.setZoom(this._zoom)
  }

  destroy() {
    this.removeEventListeners()
  }

  private setupEventListeners() {
    window.addEventListener('wheel', this.eventListeners.onResize)
    this.gui.events.on('zoom-reset', this.eventListeners.onZoomReset)
    this.gui.events.on('zoom-in', this.eventListeners.onZoomIn)
    this.gui.events.on('zoom-out', this.eventListeners.onZoomOut)
    this.gui.events.on('toggle-game-pause', this.eventListeners.onPauseToggle)
  }

  private removeEventListeners() {
    window.removeEventListener('wheel', this.eventListeners.onResize)
    this.gui.events.off('zoom-reset', this.eventListeners.onZoomReset)
    this.gui.events.off('zoom-in', this.eventListeners.onZoomIn)
    this.gui.events.off('zoom-out', this.eventListeners.onZoomOut)
    this.gui.events.off('toggle-game-pause', this.eventListeners.onPauseToggle)
  }

  private togglePause() {
    this.paused = !this.paused
  }

  private handleMouseWheel(event: WheelEvent) {
    if (this.paused) {
      return
    }
    this.zoom = this._zoom - ((event.deltaY / 52) * 0.5) / (this._zoom + 1)
    this.gui.setZoom(this._zoom)
  }

  private resetZoom() {
    this.zoom = 1
    this.gui.setZoom(this._zoom)
  }

  private zoomIn() {
    this.zoom = this._zoom - 0.5 / (this._zoom + 1)
    this.gui.setZoom(this._zoom)
  }

  private zoomOut() {
    this.zoom = this._zoom + 0.5 / (this._zoom + 1)
    this.gui.setZoom(this._zoom)
  }

  get zoom() {
    throw new Error('Cannot get internal camera zoom directly')
  }

  set zoom(value: number) {
    this._zoom = clamp(value, GameCamera.MIN_ZOOM, GameCamera.MAX_ZOOM)
    console.log('zoom:', this._zoom)
  }

  get visibleZoom() {
    return this._visibleZoom
  }

  get targetPosition(): Readonly<Vector3> {
    return this.visibleTargetPosition
  }

  setTarget(target: ObjectBase) {
    this._target = target
  }

  update(deltaTime: number) {
    const targetPos = this._target?.position
      .copy()
      .addV(this.properties.targetPositionOffset)
    const diffVec = this.position.copy().subtractV(targetPos ?? vector3Zero)

    this.position.subtractV(
      diffVec.scale(
        Math.min(
          1,
          deltaTime *
            GameCamera.MOVEMENT_SMOOTHNESS *
            Math.pow(diffVec.getLength(), 0.5),
        ),
      ),
    )

    const targetDiffVec = (this._target?.position ?? vector3Zero)
      .copy()
      .subtractV(this.visibleTargetPosition)
    this.visibleTargetPosition.addV(
      targetDiffVec.scale(
        Math.min(
          1,
          deltaTime *
            GameCamera.TARGET_MOVEMENT_SMOOTHNESS *
            Math.pow(targetDiffVec.getLength(), 0.5),
        ),
      ),
    )

    const zoomDiff = this._zoom - this._visibleZoom
    const diffSign = Math.sign(zoomDiff)
    if (Math.abs(zoomDiff) > GameCamera.MINIMUM_ZOOM_DIFFERENCE) {
      this._visibleZoom +=
        Math.sign(zoomDiff) *
        Math.max(0.01, Math.pow(Math.abs(zoomDiff), 1.5)) *
        deltaTime *
        GameCamera.ZOOM_SPEED

      if (diffSign !== Math.sign(this._zoom - this._visibleZoom)) {
        this._visibleZoom = this._zoom
      }
    }
  }
}
