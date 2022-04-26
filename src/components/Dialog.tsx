import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import './Dialog.scss'

interface DialogProps {
  open: boolean
  onConfirm?: () => void
  onClose?: () => void
  title?: React.ReactNode
  className?: string
}

export const Dialog: React.FC<React.PropsWithChildren<DialogProps>> = ({
  children,
  open,
  onConfirm,
  onClose,
  title,
  className,
}) => {
  const [t] = useTranslation()

  if (!open) {
    //TODO: implement some closing animation system
    return null
  }

  return (
    <div className={clsx('dialog-overlay', className)}>
      <div className="dialog">
        {title && <header>{title}</header>}
        <div className="dialog-content">{children}</div>
        {(onClose || onConfirm) && (
          <div className="options">
            {onClose && <button onClick={onClose}>{t('common:cancel')}</button>}
            {onConfirm && (
              <button onClick={onConfirm}>{t('common:confirm')}</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
