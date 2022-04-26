import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { AppContext } from './context/appContext'
import { useStorageState } from './hooks/useStorageState'
import { GameProgress, GAME_MAP, GAME_MODE } from './utils'
import { GameView } from './views/game/GameView'
import { MenuView } from './views/menu/MenuView'

import 'react-toastify/dist/ReactToastify.css'
import './style/toastr.scss'

enum VIEW {
  MENU,
  GAME,
}

const View = () => {
  const [t] = useTranslation()

  const [view, setView] = useState(VIEW.MENU)
  const [gameMode, setGameMode] = useState<GAME_MODE | null>(null)
  const [gameMap, setGameMap] = useState<GAME_MAP | null>(null)

  const handleGameStart = useCallback((mode: GAME_MODE, map: GAME_MAP) => {
    setGameMode(mode)
    setGameMap(map)
    setView(VIEW.GAME)
  }, [])

  const handleExitGame = useCallback(() => {
    setGameMode(null)
    setGameMap(null)
    setView(VIEW.MENU)
  }, [])

  switch (view) {
    default:
      return <div>{t('error:incorrectView')}</div>
    case VIEW.MENU:
      return <MenuView onStartGame={handleGameStart} />
    case VIEW.GAME:
      return gameMode !== null && gameMap !== null ? (
        <GameView onExit={handleExitGame} mode={gameMode} map={gameMap} />
      ) : (
        <div>{t('error:noGameModeOrMapChosen')}</div>
      )
  }
}

const App = () => {
  const [username, setUsername] = useStorageState('username', '')
  const [gameProgress, setGameProgress] = useStorageState<GameProgress>(
    'gameProgress',
    {
      [GAME_MODE.TUTORIAL]: { completedBy: [] },
      [GAME_MODE.CAMPAIGN]: {},
      [GAME_MODE.SURVIVAL]: {},
    },
  )

  const context = useMemo(
    () => ({
      username,
      setUsername,
      gameProgress,
      setGameProgress,
    }),
    [gameProgress, setGameProgress, setUsername, username],
  )

  return (
    <AppContext.Provider value={context}>
      <View />
      <ReactTooltip multiline border className="tooltip" />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        closeButton={false}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
    </AppContext.Provider>
  )
}

export default App
