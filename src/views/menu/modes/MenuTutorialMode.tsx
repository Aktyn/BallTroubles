import { useContext, useMemo } from 'react'
import { mdiPlay } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../../context/appContext'
import { GAME_MAP, GAME_MODE } from '../../../utils'
import { MenuModeCommonHeader } from './MenuModeCommonHeader'
import { CommonMenuModeProperties } from './common'

import './MenuTutorialMode.scss'

export const MenuTutorialMode = ({
  onModeChange,
  onStartGame,
}: CommonMenuModeProperties) => {
  const [t] = useTranslation()
  const app = useContext(AppContext)

  const userCompletedTutorial = useMemo(() => {
    return app.gameProgress[GAME_MODE.TUTORIAL].completedBy.includes(
      app.username,
    )
  }, [app.gameProgress, app.username])

  return (
    <div className="menu-tutorial-mode">
      <MenuModeCommonHeader
        title={t('menu:gameMode.tutorial.title')}
        onModeChange={onModeChange}
      />
      <label style={{ whiteSpace: 'pre-line' }}>
        {t(
          userCompletedTutorial
            ? 'menu:gameMode.tutorial.userHasCompletedTutorial'
            : 'menu:gameMode.tutorial.userHasNotCompletedTutorial',
        )}
      </label>
      <button
        style={{ fontSize: 22 }}
        onClick={() => onStartGame?.(GAME_MODE.TUTORIAL, GAME_MAP.TUTORIAL)}
      >
        <Icon path={mdiPlay} size="24px" style={{ marginRight: 4 }} />
        {t(
          userCompletedTutorial
            ? 'menu:gameMode.tutorial.startAgain'
            : 'menu:gameMode.tutorial.start',
        )}
      </button>
    </div>
  )
}
