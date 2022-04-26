import { AppContextSchema } from '../context/appContext'
import { GAME_MODE } from '../utils'
import { GameCore } from './gameCore'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'

export class CampaignGameMode extends GameCore {
  // private readonly goal: CampaignGoal; //TODO: implement some system for different campaign goals like surviving given amount of time, killing given amount of enemies, going to the exit portal, etc.

  constructor(
    appContext: AppContextSchema,
    renderer: Renderer,
    gui: GUIController,
  ) {
    super(GAME_MODE.CAMPAIGN, renderer, gui)
  }

  protected onGameOver(isPlayerDead: boolean) {
    //TODO: save results

    super.onGameOver(isPlayerDead)
  }
}
