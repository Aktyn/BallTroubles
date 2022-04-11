import { SECOND } from 'utils'
import { GameEngine } from './engine'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'
import { Resources } from './resources'

export class GameCore {
  private readonly gui: GUIController
  private readonly renderer: Renderer
  private readonly engine = new GameEngine()

  private readonly updateFrame = this.update.bind(this)

  private running = false
  private previousTime = 0

  constructor(renderer: Renderer, gui: GUIController) {
    this.gui = gui
    this.renderer = renderer

    Resources.onLoadingFinished(() => {
      this.gui.setLoadingResources(false)
    })
  }

  destroy() {
    this.renderer.destroy()
  }

  startGame() {
    if (this.running) {
      console.warn('Game is already running')
      return
    }

    //TODO: load game data

    this.running = true
    this.update(0)
  }

  private update(time: number) {
    const deltaTime = (time - this.previousTime) / 1000
    if (((time / SECOND) | 0) > ((this.previousTime / SECOND) | 0)) {
      this.gui.updateFPS(1 / deltaTime)
    }
    this.previousTime = time

    this.engine.update(deltaTime)
    this.renderer.render(this.engine.getMap())

    if (this.running) {
      window.requestAnimationFrame(this.updateFrame)
    }
  }
}
