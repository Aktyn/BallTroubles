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

  protected onGameOver(isPlayerDead: boolean) {
    //TODO: save results

    super.onGameOver(isPlayerDead)
  }
}
