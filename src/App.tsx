import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import { GAME_MAP, GAME_MODE } from 'utils'
import { AppContext } from './context/appContext'
import { useStorageState } from './hooks/useStorageState'
import { GameView } from './views/game/GameView'
import { MenuView } from './views/menu/MenuView'

enum VIEW {
  MENU,
  GAME,
}

const View = () => {
  const [t] = useTranslation()

  const [view, setView] = useState(VIEW.MENU)
  const [gameMode, setGameMode] = useState<GAME_MODE | null>(null)
  const [gameMap, setGameMap] = useState<GAME_MAP | null>(null)

  const handleGameStart = (mode: GAME_MODE, map: GAME_MAP) => {
    setGameMode(mode)
    setGameMap(map)
    setView(VIEW.GAME)
  }

  switch (view) {
    default:
      return <div>{t('error:incorrectView')}</div>
    case VIEW.MENU:
      return <MenuView onStartGame={handleGameStart} />
    case VIEW.GAME:
      return gameMode !== null && gameMap !== null ? (
        <GameView mode={gameMode} map={gameMap} />
      ) : (
        <div>{t('error:noGameModeOrMapChosen')}</div>
      )
  }
}

const App = () => {
  const [username, setUsername] = useStorageState('username', '')

  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
      }}
    >
      <View />
      <ReactTooltip multiline border className="tooltip" />
    </AppContext.Provider>
  )
}

export default App
