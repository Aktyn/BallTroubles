import { XY } from 'utils'

export class WebGLArrayBuffer {
  private readonly gl: WebGLRenderingContext
  private readonly vertexCount: number
  private readonly positionBuffer: WebGLBuffer

  constructor(gl: WebGLRenderingContext, vertexes: XY[]) {
    this.gl = gl

    //POSITION BUFFER
    const pBuffer = gl.createBuffer()
    if (!pBuffer) {
      throw new Error('Failed to create position buffer')
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer)

    const positions = vertexes.reduce((acc, vertex) => {
      acc.push(vertex.x, vertex.y)
      return acc
    }, [] as number[])

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    this.positionBuffer = pBuffer
    this.vertexCount = vertexes.length

    //? gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  destroy() {
    //TODO
  }

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexCount)
  }
}
