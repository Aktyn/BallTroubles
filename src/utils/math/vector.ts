const EPSILON = 1e-5

abstract class Vector<Length extends number> {
  public readonly buffer: Float32Array

  constructor(size: Length) {
    this.buffer = new Float32Array(size)
  }

  set(...values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.buffer[i] = values[i]
    }
    return this
  }

  setV(vector: Readonly<Vector<Length>>) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = vector.buffer[i]
    }
    return this
  }

  add(...values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.buffer[i] += values[i]
    }
    return this
  }

  addV(vector: Readonly<Vector<Length>>) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] += vector.buffer[i]
    }
    return this
  }

  subtractV(vector: Readonly<Vector<Length>>) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] -= vector.buffer[i]
    }
    return this
  }

  lerp(vector: Readonly<Vector<Length>>, factor: number) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] += (vector.buffer[i] - this.buffer[i]) * factor
    }

    return this
  }

  dot(vector: Readonly<Vector<Length>>) {
    let sum = 0
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i] * vector.buffer[i]
    }
    return sum
  }

  scale(value: number) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] *= value
    }
    return this
  }

  scaleV(vector: Readonly<Vector<Length>>) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] *= vector.buffer[i]
    }
    return this
  }

  equals(vector: Readonly<Vector<Length>>) {
    for (let i = 0; i < this.buffer.length; i++) {
      if (this.buffer[i] !== vector.buffer[i]) {
        return false
      }
    }
  }

  sumComponents() {
    let sum = 0
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i]
    }
    return sum
  }

  getAverage() {
    if (this.buffer.length === 0) {
      return 0
    }

    return this.sumComponents() / this.buffer.length
  }

  getLengthSquared() {
    let sum = 0
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i] * this.buffer[i]
    }
    return sum
  }

  getLength() {
    const squaredLength = this.getLengthSquared()
    if (squaredLength < EPSILON) {
      return 0
    }
    return Math.sqrt(squaredLength)
  }

  normalize() {
    const len = this.getLength()
    if (len <= EPSILON) {
      for (let i = 0; i < this.buffer.length; i++) {
        this.buffer[i] = i === 0 ? 1 : 0
      }
      return this
    }
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] /= len
    }
    return this
  }
}

// eslint-disable-next-line i18next/no-literal-string
const availablePropertyNames = ['x', 'y', 'z', 'w'] as const

// type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift'
// type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
//   TObj,
//   Exclude<keyof TObj, ArrayLengthMutationKeys>
// > & {
//   readonly length: L
//   [I: number]: T
//   [Symbol.iterator]: () => IterableIterator<T>
// }

function WithPropertyAccessors<
  PropertyNamesType extends typeof availablePropertyNames[number],
>(...propertyNames: PropertyNamesType[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <ClassType extends { new (...args: any[]): Vector<number> }>(
    constructor: ClassType,
  ): ClassType extends {
    new (...args: infer NA): infer ReturnClassType
  }
    ? {
        new (...args: NA): ReturnClassType & {
          [_ in PropertyNamesType]: number
        } & {
          toJSON: () => { [_ in PropertyNamesType]: number }
        }
      }
    : never {
    const forEachPropertyName = (
      callback: (propertyName: string, index: number) => void,
    ) => {
      for (const propertyName of propertyNames) {
        if (!availablePropertyNames.includes(propertyName)) {
          throw new Error(`Property name ${propertyName} is not available`)
        }
        const index = availablePropertyNames.indexOf(propertyName)

        callback(propertyName, index)
      }
    }

    let extendedConstructor = class extends constructor {
      toJSON() {
        const json: Record<string, number> = {}
        forEachPropertyName((propertyName, index) => {
          json[propertyName] = this.buffer[index]
        })
        return json as { [_ in PropertyNamesType]: number }
      }
    }

    forEachPropertyName((propertyName, index) => {
      extendedConstructor = class extends extendedConstructor {
        get [propertyName]() {
          return this.buffer[index]
        }
        set [propertyName](value: number) {
          this.buffer[index] = value
        }
      }
    })

    return extendedConstructor as never
  }
}

export const Vector2 = WithPropertyAccessors(
  'x',
  'y',
)(
  class InternalVector2 extends Vector<2> {
    constructor(x?: number, y?: number) {
      super(2)
      this.set(x ?? 0, y ?? 0)
    }

    copy() {
      return new Vector2(this.buffer[0], this.buffer[1])
    }

    toAngle() {
      return Math.atan2(this.buffer[1], this.buffer[0])
    }
  },
)
export type Vector2 = InstanceType<typeof Vector2>

export const Vector3 = WithPropertyAccessors(
  'x',
  'y',
  'z',
)(
  class InternalVector3 extends Vector<3> {
    constructor(x?: number, y?: number, z?: number) {
      super(3)
      this.set(x ?? 0, y ?? 0, z ?? 0)
    }

    copy() {
      return new Vector3(this.buffer[0], this.buffer[1], this.buffer[2])
    }
  },
)
export type Vector3 = InstanceType<typeof Vector3>
