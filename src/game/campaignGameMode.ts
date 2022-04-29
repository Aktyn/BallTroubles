import { AppContextSchema } from '../context/appContext'
import { GAME_MAP, GAME_MODE } from '../utils'
import { GameCore } from './gameCore'
import { GameGoal } from './goals/gameGoal'
import { KillEnemiesGoal } from './goals/killEnemiesGoal'
import { Renderer } from './graphics/renderer'
import { GUIController } from './gui'

export class CampaignGameMode extends GameCore {
  // Different campaign goals like surviving given amount of time, killing given amount of enemies, going to the exit portal, etc.
  private readonly goals: GameGoal[] = []

  constructor(
    appContext: AppContextSchema,
    renderer: Renderer,
    gui: GUIController,
  ) {
    super(GAME_MODE.CAMPAIGN, renderer, gui)
  }

  destroy() {
    for (const goal of this.goals) {
      goal.destroy()
    }
    this.engine?.events.removeAllListeners()
    this.goals.length = 0
    super.destroy()
  }

  private addScore(score: number) {
    this.score += score
    this.gui.setGameScore(this.score)
  }

  onUpdate(deltaTime: number) {
    const everyGoalReached = this.goals.every((goal) => {
      goal.update(deltaTime)
      return goal.isReached()
    })

    if (everyGoalReached) {
      console.log('All goals has been reached')
      //TODO: save result to appContext
      this.onGameOver(false)
    }
  }

  onGameStarted(map: GAME_MAP) {
    if (!this.engine) {
      throw new Error('Game engine is not initialized')
    }

    for (const goal of this.goals) {
      goal.reset()
    }

    this.gui.setGameScore(this.score)

    switch (map) {
      case GAME_MAP.MAP1:
        this.goals.push(new KillEnemiesGoal(this.engine, this.gui, 2))
    }

    this.engine.events.on('enemy-damaged', (damage) =>
      this.addScore(damage * GameCore.DAMAGE_SCORE_MULTIPLIER),
    )

    this.engine.events.on('enemy-killed', () =>
      this.addScore(GameCore.KILL_SCORE),
    )
  }

  protected onGameOver(isPlayerDead: boolean) {
    super.onGameOver(isPlayerDead)
  }
}
