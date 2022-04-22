import EventEmitter from 'events'
import {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useContext,
} from 'react'
import { mdiDevTo, mdiMinus, mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '../../components/IconButton'
import { AppContext } from '../../context/appContext'
import { Resources } from '../resources'

import './gui.scss'

declare interface GUIEventEmitter {
  on(event: 'zoom-reset', listener: () => void): this
  on(event: 'zoom-in', listener: () => void): this
  on(event: 'zoom-out', listener: () => void): this

  emit(event: 'zoom-reset'): boolean
  emit(event: 'zoom-in'): boolean
  emit(event: 'zoom-out'): boolean
}

class GUIEventEmitter extends EventEmitter {}

export interface GUIController {
  setFPS: React.Dispatch<React.SetStateAction<number>>
  setZoom: React.Dispatch<React.SetStateAction<number>>
  setLoadingResources: (loading: boolean) => void
  events: GUIEventEmitter
}

export const GUI = forwardRef<GUIController>(function GUI(_, ref) {
  const app = useContext(AppContext)
  const [t] = useTranslation()

  const emitterRef = useRef<GUIEventEmitter>(new GUIEventEmitter())

  const [fps, setFPS] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [loadingResources, setLoadingResources] = useState(Resources.loading)

  useImperativeHandle(ref, () => ({
    setFPS,
    setZoom,
    setLoadingResources,
    events: emitterRef.current,
  }))

  return (
    <div className="gui-main">
      <div className="left-panel">
        {loadingResources && <div>Loading resources...</div>}
        <div>
          {t('menu:username')}:&nbsp;
          <strong>{app.username}</strong>
        </div>
        <div>
          FPS: <strong>{Math.round(fps)}</strong>
        </div>
        <div className="flex gap-8">
          <span>Zoom:</span>
          <IconButton
            path={mdiMinus}
            title="Zoom out"
            size="20px"
            onClick={() => emitterRef.current.emit('zoom-in')}
          />
          <strong>{Number(zoom).toFixed(2)}</strong>
          <IconButton
            path={mdiPlus}
            title="Zoom out"
            size="20px"
            onClick={() => emitterRef.current.emit('zoom-out')}
          />
          <button
            className="sidebar-button"
            onClick={() => emitterRef.current.emit('zoom-reset')}
          >
            RESET
          </button>
        </div>
        <div>
          <Icon path={mdiDevTo} title="User Profile" size="48px" />
        </div>
      </div>
    </div>
  )
})
