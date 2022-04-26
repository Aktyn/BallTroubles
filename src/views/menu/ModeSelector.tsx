import { useState } from 'react'

import { MenuCampaignMode } from './modes/MenuCampaignMode'
import { MenuHighscoresMode } from './modes/MenuHighscoresMode'
import { MenuHomeMode } from './modes/MenuHomeMode'
import { MenuSurvivalMode } from './modes/MenuSurvivalMode'
import { MenuTutorialMode } from './modes/MenuTutorialMode'
import { CommonMenuModeProperties, MENU_MODE } from './modes/common'

export const ModeSelector = ({
  onStartGame,
}: Required<Pick<CommonMenuModeProperties, 'onStartGame'>>) => {
  const [menuMode, setMenuMode] = useState(MENU_MODE.HOME)

  const viewProps: CommonMenuModeProperties = {
    onModeChange: setMenuMode,
    onStartGame,
  }

  switch (menuMode) {
    default:
    case MENU_MODE.HOME:
      return <MenuHomeMode {...viewProps} />
    case MENU_MODE.CAMPAIGN:
      return <MenuCampaignMode {...viewProps} />
    case MENU_MODE.SURVIVAL:
      return <MenuSurvivalMode {...viewProps} />
    case MENU_MODE.TUTORIAL:
      return <MenuTutorialMode {...viewProps} />
    case MENU_MODE.HIGHSCORES:
      return <MenuHighscoresMode {...viewProps} />
  }
}
