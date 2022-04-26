export interface XY {
  x: number
  y: number
}

export interface XYZ extends XY {
  z: number
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0
}

export function mix(val1: number, val2: number, factor: number) {
  return val1 * (1 - factor) + val2 * factor
}
