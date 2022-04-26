import { AppContextSchema } from '../context/appContext'
import { GAME_MODE } from '../utils'
import { GameCore } from './gameCore'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'

export class TutorialGameMode extends GameCore {
  private readonly appContext: AppContextSchema

  constructor(
    appContext: AppContextSchema,
    renderer: Renderer,
    gui: GUIController,
  ) {
    super(GAME_MODE.TUTORIAL, renderer, gui)
    this.appContext = appContext
  }

  protected onGameOver(isPlayerDead: boolean) {
    // Add the current player to the list of players who completed the tutorial
    if (
      !this.appContext.gameProgress[GAME_MODE.TUTORIAL].completedBy.includes(
        this.appContext.username,
      )
    ) {
      this.appContext.setGameProgress({
        ...this.appContext.gameProgress,
        [GAME_MODE.TUTORIAL]: {
          completedBy: [
            ...this.appContext.gameProgress[GAME_MODE.TUTORIAL].completedBy,
            this.appContext.username,
          ],
        },
      })
    }

    super.onGameOver(isPlayerDead)
  }
}
