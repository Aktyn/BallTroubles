import { SECOND } from '../utils'
import { GameEngine } from './engine'
import { KeyboardSteering } from './engine/common/steering'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'
import { generateTutorialMap } from './mapGenerators/tutorialMapGenerator'
import { Resources } from './resources'

const MAX_DELTA_TIME = 0.5

export class GameCore {
  private readonly gui: GUIController
  private readonly renderer: Renderer
  private readonly engine: GameEngine
  private steering: KeyboardSteering | null = null

  private readonly updateFrame = this.update.bind(this)

  private running = false
  private previousTime = 0

  private frameCounter = 0

  constructor(renderer: Renderer, gui: GUIController) {
    this.gui = gui
    this.renderer = renderer
    this.engine = new GameEngine(gui)

    Resources.onLoadingFinished(() => {
      this.gui.setLoadingResources(false)
    })
  }

  destroy() {
    this.renderer.destroy()
    this.engine.destroy()
    this.steering?.destroy()
    this.steering = null
    this.running = false
  }

  startGame() {
    if (this.running) {
      console.warn('Game is already running')
      return
    }

    this.steering = new KeyboardSteering()

    Resources.onLoadingFinished(() => {
      generateTutorialMap(this.engine, this.renderer)
      if (this.steering) {
        this.engine.spawnPlayer(this.steering, true)
      }
    })

    this.running = true
    this.update(0)
  }

  private update(time: number) {
    const deltaTime = (time - this.previousTime) / 1000
    if (((time / SECOND) | 0) > ((this.previousTime / SECOND) | 0)) {
      this.gui.setFPS(this.frameCounter)
      this.frameCounter = 0
    }
    this.frameCounter++
    this.previousTime = time

    if (deltaTime <= MAX_DELTA_TIME) {
      this.engine.update(deltaTime)
      this.renderer.render(this.engine.getMap())
    } else {
      console.warn(`Delta time is too big: ${deltaTime}. Skipping frame.`)
    }

    if (this.running) {
      window.requestAnimationFrame(this.updateFrame)
    }
  }
}
