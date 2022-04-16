import { GameMap } from '../engine/gameMap'
import { BACKGROUND_TEXTURE } from '../engine/objects/common'

export interface EnvironmentOptions {
  color: number | string
  ambientLight: {
    color?: number | string
    intensity: number
  }
  fog: {
    color?: number | string
    near: number
    far: number
  }
  backgroundColor: number | string
  backgroundTexture: BACKGROUND_TEXTURE
}

export abstract class Renderer {
  protected readonly canvas: HTMLCanvasElement

  private readonly eventListeners = {
    onResize: this.handleScreenResize.bind(this),
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    this.setupEventListeners()
    this.adjustCanvasSize()
  }

  public destroy() {
    this.removeEventListeners()
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.eventListeners.onResize)
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.eventListeners.onResize)
  }

  private handleScreenResize() {
    this.adjustCanvasSize()
    this.onResize()
  }

  private adjustCanvasSize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height}`)
  }

  protected abstract onResize(): void
  abstract render(map: Readonly<GameMap>): void

  abstract setupEnvironment(options: Partial<EnvironmentOptions>): void
}
