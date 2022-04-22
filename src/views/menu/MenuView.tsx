import { useContext } from 'react'
import { mdiDelete } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../context/appContext'
import { languages } from '../../i18n'
import { ModeSelector } from './ModeSelector'
import { UsernameForm } from './UsernameForm'

import './MenuView.scss'
import { CommonMenuModeProperties } from './modes/common'

const flags: { [key in keyof typeof languages]: string } = {
  // eslint-disable-next-line i18next/no-literal-string
  en: '🇬🇧',
  // eslint-disable-next-line i18next/no-literal-string
  pl: '🇵🇱',
} as const

export const MenuView = ({
  onStartGame,
}: Required<Pick<CommonMenuModeProperties, 'onStartGame'>>) => {
  const [t, i18n] = useTranslation()
  const app = useContext(AppContext)

  return (
    <div className="menu-layout">
      <div className="logo">{t('appName')}</div>
      {!app.username ? (
        <UsernameForm onSave={app.setUsername} />
      ) : (
        <>
          <ModeSelector onStartGame={onStartGame} />
          <div className="user-info">
            <div className="flex" style={{ wordBreak: 'break-all' }}>
              {t('menu:username')}:&nbsp;<strong>{app.username}</strong>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => app.setUsername('')}
              >
                <Icon path={mdiDelete} size="16px" style={{ marginRight: 4 }} />
                {t('common:clear')}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="language-selector">
        {Object.keys(languages).map((lang) => (
          <div
            key={lang}
            className={clsx(i18n.resolvedLanguage === lang && 'selected')}
            data-tip={languages[lang as keyof typeof languages]}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {flags[lang as keyof typeof flags]}
          </div>
        ))}
      </div>
    </div>
  )
}
