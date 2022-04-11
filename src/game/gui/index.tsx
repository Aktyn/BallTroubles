import { useImperativeHandle, forwardRef, useState } from 'react'
import { mdiDevTo } from '@mdi/js'
import Icon from '@mdi/react'
import { Resources } from 'game/resources'

import './gui.scss'

export interface GUIController {
  updateFPS: (fps: number) => void
  setLoadingResources: (loading: boolean) => void
}

export const GUI = forwardRef<GUIController>(function GUI(_, ref) {
  const [fps, setFPS] = useState(0)
  const [loadingResources, setLoadingResources] = useState(Resources.loading)

  useImperativeHandle(ref, () => ({
    updateFPS: setFPS,
    setLoadingResources,
  }))

  return (
    <div className="gui-main">
      <div className="left-panel">
        {loadingResources && <div>Loading resources...</div>}
        <div>
          FPS: <strong>{Math.round(fps)}</strong>
        </div>
        <div>
          <Icon path={mdiDevTo} title="User Profile" size="48px" />
        </div>
      </div>
    </div>
  )
})
