import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog } from '../../components/Dialog'
import { GAME_MAP, GAME_MODE } from '../../utils'

import './GameResultDialog.scss'

export interface GameResult {
  user: string
  elapsedTime: number
  score: number | null
  playerDied: boolean
}

interface CommonDialogNavigationProps {
  username: string
  onExitToMenu: () => void
}

interface GameResultDialogProps
  extends Omit<CommonDialogNavigationProps, 'username'> {
  result: GameResult | null
  mode: GAME_MODE
  map: GAME_MAP
  onRepeatGame: () => void
}

const TutorialResultBody = ({
  username,
  onExitToMenu,
}: CommonDialogNavigationProps) => {
  const [t] = useTranslation()

  return (
    <div className="tutorial-result-body">
      <div style={{ whiteSpace: 'pre-line' }}>
        {t('game:resultDialog.tutorialText', { username })}
      </div>
      <div>
        <button onClick={onExitToMenu}>
          {t('game:resultDialog.exitTutorial')}
        </button>
      </div>
    </div>
  )
}
const CampaignSuccessResultBody = ({
  username,
  score,
  map,
  onExitToMenu,
  onRepeatGame,
}: CommonDialogNavigationProps &
  Pick<GameResultDialogProps, 'onRepeatGame' | 'map'> & { score: number }) => {
  const [t] = useTranslation()

  const nextMapUnlocked = useMemo(() => {
    const mapsArray = Object.values(GAME_MAP)
    const nextMapIndex = mapsArray.indexOf(map) + 1

    return mapsArray[nextMapIndex] !== GAME_MAP.TUTORIAL
  }, [map])

  return (
    <div className="campaign-success-result-body">
      <div>
        <div>
          <span>{t('game:resultDialog.congratulations')}</span>&nbsp;
          <strong>{username}</strong>
        </div>
        <div>
          <span>{t('game:resultDialog.resultScore')}</span>:&nbsp;
          <strong>{score}</strong>
        </div>
        <div>
          {t(
            nextMapUnlocked
              ? 'game:resultDialog.nextMapUnlocked'
              : 'game:resultDialog.campaignFinished',
          )}
        </div>
      </div>
      <div className="flex gap-8">
        <button onClick={onExitToMenu}>
          {t('game:resultDialog.backToMenu')}
        </button>
        <button onClick={onRepeatGame}>
          {t('game:resultDialog.repeatMap')}
        </button>
        {nextMapUnlocked && <button>{t('game:resultDialog.nextMap')}</button>}
      </div>
    </div>
  )
}

const CampaignFailureResultBody = ({
  onExitToMenu,
  onRepeatGame,
}: Pick<CommonDialogNavigationProps, 'onExitToMenu'> &
  Pick<GameResultDialogProps, 'onRepeatGame'>) => {
  const [t] = useTranslation()

  return (
    <div className="campaign-failure-result-body">
      <div style={{ whiteSpace: 'pre-line' }}>
        {t('game:resultDialog.campaignFailureText')}
      </div>
      <div className="flex gap-8">
        <button onClick={onExitToMenu}>
          {t('game:resultDialog.backToMenu')}
        </button>
        <button onClick={onRepeatGame}>
          {t('game:resultDialog.tryAgain')}
        </button>
      </div>
    </div>
  )
}

const SurvivalResultBody = () => {
  return null
}

export const GameResultDialog = ({
  result,
  mode,
  map,
  onExitToMenu,
  onRepeatGame,
}: GameResultDialogProps) => {
  const [t] = useTranslation()

  return (
    <Dialog
      open={!!result}
      className="game-result-dialog"
      title={t(
        mode === GAME_MODE.TUTORIAL
          ? 'game:resultDialog.tutorialTitle'
          : result?.playerDied
          ? 'game:resultDialog.deathTitle'
          : 'game:resultDialog.mapCompletedTitle',
      )}
    >
      <div>
        {mode === GAME_MODE.TUTORIAL && (
          <TutorialResultBody
            username={result?.user ?? '-'}
            onExitToMenu={onExitToMenu}
          />
        )}
        {mode === GAME_MODE.CAMPAIGN &&
          (result?.playerDied ? (
            <CampaignFailureResultBody
              onExitToMenu={onExitToMenu}
              onRepeatGame={onRepeatGame}
            />
          ) : (
            <CampaignSuccessResultBody
              username={result?.user ?? '-'}
              score={result?.score ?? 0}
              onExitToMenu={onExitToMenu}
              onRepeatGame={onRepeatGame}
              map={map}
            />
          ))}
        {mode === GAME_MODE.SURVIVAL && <SurvivalResultBody />}
      </div>
    </Dialog>
  )
}
