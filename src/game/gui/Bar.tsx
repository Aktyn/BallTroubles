import './Bar.scss'
import { useMemo } from 'react'
import palette from '../../style/palette.json'
import { HexColor, mixColors } from '../../utils'

interface BarProps {
  /** Value between 0 and 1 */
  value: number
  height?: number
  colors?: HexColor[]
}

const defaultColors = [
  palette.red[400] as HexColor,
  palette.green[400] as HexColor,
]

export const Bar = ({
  value,
  height = 24,
  colors = defaultColors,
}: BarProps) => {
  const mixedColor = useMemo(() => {
    if (colors.length === 0) {
      return palette.black
    }
    if (colors.length === 1) {
      return colors[0]
    }

    const intermediateValue = value * (colors.length - 1)
    const index1 = Math.floor(intermediateValue)
    const index2 = Math.ceil(intermediateValue)
    if (index1 === index2) {
      return colors[index1]
    }

    const mixValue = (intermediateValue - index1) / (index2 - index1) //index2 - index1 should always equal 1
    if (isNaN(mixValue)) {
      return colors[index1]
    }

    return mixColors(colors[index1], colors[index2], mixValue)
  }, [colors, value])

  const percent = Math.round(value * 100)

  return (
    <div className="bar" style={{ height, borderRadius: height }}>
      <div
        className="level"
        style={{
          width: `${percent}%`,
          backgroundColor: mixedColor,
          borderRadius: height,
        }}
      />
      <span className="percentage-value">{percent}%</span>
    </div>
  )
}
