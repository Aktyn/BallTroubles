import { mdiChevronLeft } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { CommonMenuModeProperties, MENU_MODE } from './common'

import './MenuModeCommonHeader.scss'

interface MenuModeCommonHeaderProps {
  title: React.ReactNode
}

export const MenuModeCommonHeader = ({
  title,
  onModeChange,
}: MenuModeCommonHeaderProps &
  Pick<CommonMenuModeProperties, 'onModeChange'>) => {
  const [t] = useTranslation()

  return (
    <header className="menu-mode-common-header">
      <span />
      <span>{title}</span>
      <button onClick={() => onModeChange(MENU_MODE.HOME)}>
        <Icon path={mdiChevronLeft} size="16px" style={{ marginRight: 4 }} />
        {t('common:return')}
      </button>
    </header>
  )
}
