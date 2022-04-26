import { useMemo } from 'react'
import './Loader.scss'

interface LoaderProps {
  size?: number
}

export const Loader = ({ size = 64 }: LoaderProps) => {
  const h = Math.round(size / 3)

  const itemStyle: React.CSSProperties = useMemo(
    () => ({ width: h, height: h }),
    [h],
  )

  return (
    <div className="loader" style={{ width: size, height: h }}>
      <span style={itemStyle} />
      <span style={itemStyle} />
      <span style={itemStyle} />
    </div>
  )
}
