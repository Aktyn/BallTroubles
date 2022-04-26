import { mix } from './math'

export interface RGB {
  r: number
  g: number
  b: number
}

export type HexColor = `#${string}`

function hexToRGB(color: HexColor): RGB {
  let hex = color.startsWith('#') ? color.slice(1) : color

  if (hex.length !== 6) {
    if (hex.length !== 3) {
      throw new Error('Incorrect hex color')
    }
    hex = [...hex].reduce((acc, val) => acc + val + val, '')
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

function rgbToHex(color: RGB): HexColor {
  const { r, g, b } = color
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function mixColors(color1: HexColor, color2: HexColor, factor: number) {
  const rgb1 = hexToRGB(color1)
  const rgb2 = hexToRGB(color2)

  return rgbToHex({
    r: Math.floor(mix(rgb1.r, rgb2.r, factor)),
    g: Math.floor(mix(rgb1.g, rgb2.g, factor)),
    b: Math.floor(mix(rgb1.b, rgb2.b, factor)),
  })
}
