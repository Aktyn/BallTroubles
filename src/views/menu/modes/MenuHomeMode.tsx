/* eslint-disable @typescript-eslint/no-var-requires */
import {
  mdiClockOutline,
  mdiPlayOutline,
  mdiPodium,
  mdiSchoolOutline,
} from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { CommonMenuModeProperties, MENU_MODE } from './common'

import './MenuHomeMode.scss'

//TODO: create background image for each card
const campaignCardBackground = require('../../../assets/textures/menu/campaign.webp')
const highscoresCardBackground = require('../../../assets/textures/menu/highscores.webp')
const survivalCardBackground = require('../../../assets/textures/menu/survival.webp')
const tutorialCardBackground = require('../../../assets/textures/menu/tutorial.webp')

interface CardProps {
  onClick: () => void
  title: React.ReactNode
  backgroundImageSrc?: string
  hoverContent?: React.ReactNode
}

const Card = ({
  onClick,
  title,
  backgroundImageSrc,
  hoverContent,
}: CardProps) => {
  return (
    <div className="card" onClick={onClick}>
      {backgroundImageSrc && (
        <div
          className="card-background"
          style={{ backgroundImage: `url(${backgroundImageSrc})` }}
        />
      )}
      <header>{title}</header>
      <div className="hover-content">{hoverContent}</div>
    </div>
  )
}

const hoverImageStyle: React.CSSProperties = {
  stroke: '#0008',
  strokeWidth: 0.1,
}

export const MenuHomeMode = ({ onModeChange }: CommonMenuModeProperties) => {
  const [t] = useTranslation()

  return (
    <div className="menu-home-mode">
      <div>
        <label className="category-label">{t('menu:category.play')}</label>
        <div className="cards-row">
          <Card
            title={t('menu:gameMode.campaign.title')}
            backgroundImageSrc={campaignCardBackground}
            hoverContent={
              <div>
                <Icon
                  path={mdiPlayOutline}
                  size="128px"
                  style={{ ...hoverImageStyle }}
                />
                <div style={{ fontSize: 22 }}>
                  {t('menu:gameMode.campaign.shortInfo')}
                </div>
              </div>
            }
            onClick={() => onModeChange(MENU_MODE.CAMPAIGN)}
          />
          <Card
            title={t('menu:gameMode.survival.title')}
            backgroundImageSrc={survivalCardBackground}
            hoverContent={
              <div>
                <Icon
                  path={mdiClockOutline}
                  size="128px"
                  style={{ ...hoverImageStyle }}
                />
                <div style={{ fontSize: 22 }}>
                  {t('menu:gameMode.survival.shortInfo')}
                </div>
              </div>
            }
            onClick={() => onModeChange(MENU_MODE.SURVIVAL)}
          />
        </div>
      </div>
      <div>
        <label className="category-label">
          {t('menu:category.otherOptions')}
        </label>
        <div className="cards-row">
          <Card
            title={t('menu:gameMode.tutorial.title')}
            backgroundImageSrc={tutorialCardBackground}
            hoverContent={
              <div>
                <Icon
                  path={mdiSchoolOutline}
                  size="128px"
                  style={{ ...hoverImageStyle }}
                />
                <div style={{ fontSize: 22 }}>
                  {t('menu:gameMode.tutorial.shortInfo')}
                </div>
              </div>
            }
            onClick={() => onModeChange(MENU_MODE.TUTORIAL)}
          />
          <Card
            title={t('menu:highscores.title')}
            backgroundImageSrc={highscoresCardBackground}
            hoverContent={
              <div>
                <Icon
                  path={mdiPodium}
                  size="128px"
                  style={{ ...hoverImageStyle }}
                />
                <div style={{ fontSize: 22 }}>
                  {t('menu:highscores.shortInfo')}
                </div>
              </div>
            }
            onClick={() => onModeChange(MENU_MODE.HIGHSCORES)}
          />
        </div>
      </div>
    </div>
  )
}
