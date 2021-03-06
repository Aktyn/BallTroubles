import { AppContextSchema } from '../context/appContext'
import { GAME_MODE } from '../utils'
import { GameCore } from './gameCore'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'

export class SurvivalGameMode extends GameCore {
  constructor(
    appContext: AppContextSchema,
    renderer: Renderer,
    gui: GUIController,
  ) {
    super(GAME_MODE.SURVIVAL, renderer, gui)
  }

  onUpdate() {
    // noop
  }

  onGameStarted() {
    this.engine?.events.on('enemy-damaged', (damage) => {
      console.log(damage)
    })
  }

  protected onGameOver(isPlayerDead: boolean) {
    //TODO: save results

    super.onGameOver(isPlayerDead)
  }
}
