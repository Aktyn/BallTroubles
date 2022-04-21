export interface XY {
  x: number
  y: number
}

export interface XYZ extends XY {
  z: number
}

export interface RGB {
  r: number
  g: number
  b: number
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0
}
