import { SECOND, GAME_MAP, GAME_MODE } from '../utils'
import { KeyboardSteering } from './engine/common/steering'
import { GameEngine } from './engine/gameEngine'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'
import { generateTutorialMap } from './mapGenerators/tutorialMapGenerator'
import { Resources } from './resources'

const MAX_DELTA_TIME = 0.5

export abstract class GameCore {
  private readonly mode: GAME_MODE
  private readonly gui: GUIController
  private readonly renderer: Renderer
  private engine: GameEngine | null = null
  private steering: KeyboardSteering | null = null

  private readonly updateFrame = this.update.bind(this)

  private readonly eventListeners = {
    onPauseToggle: this.togglePause.bind(this),
  }

  private destroyed = false
  private running = false
  private paused = false
  private previousTime = 0
  private frameCounter = 0

  private elapsedTime = 0
  private score: number | null = null

  constructor(mode: GAME_MODE, renderer: Renderer, gui: GUIController) {
    this.mode = mode
    this.gui = gui
    this.renderer = renderer

    this.setupEventListeners()
    Resources.onLoadingFinished(() => {
      this.gui.setLoadingResources(false)
    })
  }

  destroy() {
    this.renderer.destroy()

    this.engine?.destroy()
    this.engine = null

    this.steering?.destroy()
    this.steering = null

    this.running = false
    this.removeEventListeners()

    this.destroyed = true
  }

  private setupEventListeners() {
    this.gui.events.on('toggle-game-pause', this.eventListeners.onPauseToggle)
  }

  private removeEventListeners() {
    this.gui.events.off('toggle-game-pause', this.eventListeners.onPauseToggle)
  }

  private togglePause() {
    this.gui.setPaused((this.paused = !this.paused))
  }

  protected onGameOver(isPlayerDead: boolean) {
    this.running = false
    this.gui.showResults(this.elapsedTime, this.score, isPlayerDead)
  }

  startGame(map: GAME_MAP) {
    if (this.running) {
      console.warn('Game is already running')
      return
    }

    this.steering = new KeyboardSteering()
    console.log('Starting game mode:', this.mode)
    this.engine = new GameEngine(this.gui)

    Resources.onLoadingFinished(() => {
      if (this.destroyed) {
        return
      }
      if (!this.engine) {
        throw new Error('Engine is not initialized')
      }
      if (!this.steering) {
        throw new Error('Steering is not initialized')
      }
      console.log('Loading map:', map) //TODO: switch map generators according to map parameter
      generateTutorialMap(this.engine, this.renderer)
      this.engine.spawnPlayer(this.steering, () => this.onGameOver(true), true)

      this.elapsedTime = 0
      this.previousTime = 0
      this.frameCounter = 0
      this.running = true
      this.paused = false
      this.update(0)
    })
  }

  restartGame(map: GAME_MAP) {
    this.steering?.destroy()
    this.engine?.destroy()

    this.running = false
    this.startGame(map)
  }

  private update(time: number) {
    if (this.destroyed) {
      return
    }

    if (!this.engine) {
      console.error('Engine is not initialized')
      return
    }

    const deltaTime = (time - this.previousTime) / 1000
    if (Math.floor(time / SECOND) > Math.floor(this.previousTime / SECOND)) {
      this.gui.setFPS(this.frameCounter)
      this.frameCounter = 0

      // if (this.mode === GAME_MODE.CAMPAIGN) {
      //   this.gui.setGameScore(this.score)
      // }
    }
    this.frameCounter++
    this.previousTime = time

    if (!this.paused) {
      if (deltaTime <= MAX_DELTA_TIME) {
        this.elapsedTime += deltaTime * SECOND
        this.gui.setElapsedTime(this.elapsedTime)
        this.engine.update(deltaTime)
        this.renderer.render(this.engine.getMap())
      } else {
        console.warn(`Delta time is too big: ${deltaTime}. Skipping frame.`)
      }
    }

    if (this.running) {
      window.requestAnimationFrame(this.updateFrame)
    }
  }
}
