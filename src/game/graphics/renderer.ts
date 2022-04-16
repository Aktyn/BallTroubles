import { GameMap } from '../engine/gameMap'

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
}
