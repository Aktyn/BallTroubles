class Vector {
  protected readonly buffer: Float32Array

  constructor(size: number) {
    this.buffer = new Float32Array(size)
  }

  set(...values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.buffer[i] = values[i]
    }
    return this
  }

  add(...values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.buffer[i] += values[i]
    }
    return this
  }

  scale(value: number) {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] *= value
    }
    return this
  }

  getAverage() {
    if (this.buffer.length === 0) {
      return 0
    }

    let sum = 0
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i]
    }
    return sum / this.buffer.length
  }
}

export class Vector2 extends Vector {
  constructor(x?: number, y?: number) {
    super(2)
    this.set(x ?? 0, y ?? 0)
  }

  get x() {
    return this.buffer[0]
  }

  set x(value: number) {
    this.buffer[0] = value
  }

  get y() {
    return this.buffer[1]
  }

  set y(value: number) {
    this.buffer[1] = value
  }
}
