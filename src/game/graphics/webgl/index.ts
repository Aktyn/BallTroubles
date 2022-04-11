import { ObjectBase } from 'game/engine/objects/objectBase'
import { Resources } from 'game/resources'
import { WebGLArrayBuffer } from './arrayBuffer'
import { WebGLShader } from './shader'
import { WebGLTextureEx } from './texture'

const createMainShader = (gl: WebGLRenderingContext) =>
  new WebGLShader(
    gl,
    Resources.shaders.get('main'),
    ['aVertexPosition'],
    ['uProjectionMatrix', 'uModelViewMatrix', 'uSampler'],
  )

export class WebGLEngine {
  private readonly canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private readonly square: WebGLArrayBuffer
  private readonly shaders: Readonly<{
    main: ReturnType<typeof createMainShader>
  }>
  private readonly textures = new Map<string, WebGLTextureEx>()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      // premultipliedAlpha: true,
    })

    if (gl === null) {
      throw new Error('Failed to get WebGL context')
    }
    this.gl = gl
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    this.square = new WebGLArrayBuffer(gl, [
      { x: 1.0, y: 1.0 },
      { x: -1.0, y: 1.0 },
      { x: 1.0, y: -1.0 },
      { x: -1.0, y: -1.0 },
    ])

    this.shaders = {
      main: createMainShader(gl),
    }

    this.textures.set(
      'ball',
      new WebGLTextureEx(gl, Resources.textures.get('ball')),
    )

    this.setup()
  }

  private setup() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.colorMask(true, true, true, true)
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

    this.gl.activeTexture(this.gl.TEXTURE0)

    // this.gl.enable(this.gl.DEPTH_TEST) // Enable depth testing
    // this.gl.depthFunc(this.gl.LEQUAL) // Near things obscure far things
  }

  onResize() {
    this.setup()
  }

  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // this.gl.clearDepth(1.0) // Clear everything
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  drawObjects(objects: readonly ObjectBase[], cameraBuffer: Float32Array) {
    this.shaders.main.use()
    this.shaders.main.setUniformMatrix4v('uProjectionMatrix', cameraBuffer)
    this.shaders.main.enableAttribute('aVertexPosition')

    this.textures.get('ball')?.bind()
    this.shaders.main.setUniform1i('uSampler', 0)

    for (const obj of objects) {
      this.square.bind()
      this.shaders.main.setUniformMatrix4v('uModelViewMatrix', obj.buffer)
      this.square.draw()
    }
  }
}
