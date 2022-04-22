import { useState } from 'react'

import { MenuCampaignMode } from './modes/MenuCampaignMode'
import { MenuHomeMode } from './modes/MenuHomeMode'
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
  }
}
