import { GameMap } from 'game/engine/gameMap'
import { Renderer } from './renderer'
import { WebGLEngine } from './webgl'

export class WebGLRenderer extends Renderer {
  private webGL: WebGLEngine

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.webGL = new WebGLEngine(canvas)
  }

  protected onResize() {
    this.webGL.onResize()
  }

  render(map: Readonly<GameMap>) {
    this.webGL.clear()
    this.webGL.drawObjects(map.objects, map.camera.buffer)
  }
}
