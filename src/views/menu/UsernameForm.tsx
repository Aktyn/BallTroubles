import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const UsernameForm = ({
  onSave,
}: {
  onSave: (username: string) => void
}) => {
  const [t] = useTranslation()

  const [username, setUsername] = useState('')

  const disabled = useMemo(() => {
    return username.trim().length === 0
  }, [username])

  return (
    <div className="form">
      <label>{t('menu:form.selectUsername')}</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={32}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled) {
            onSave(username)
          }
        }}
      />
      <button disabled={disabled} onClick={() => onSave(username)}>
        {t('common:apply')}
      </button>
    </div>
  )
}
