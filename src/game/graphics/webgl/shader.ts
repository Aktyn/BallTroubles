export class WebGLShader<
  AttributeName extends string,
  UniformName extends string,
> {
  private readonly gl: WebGLRenderingContext
  private program: WebGLProgram | null = null
  private attributes = new Map<AttributeName, number>()
  private uniforms = new Map<UniformName, WebGLUniformLocation>()

  constructor(
    gl: WebGLRenderingContext,
    shaderSources: {
      fragment: string
      vertex: string
    },
    attributes: AttributeName[],
    uniforms: UniformName[],
  ) {
    this.gl = gl

    this.program = this.initShaderProgram(
      gl,
      shaderSources.vertex,
      shaderSources.fragment,
    )

    for (const attributeName of attributes) {
      this.attributes.set(
        attributeName,
        gl.getAttribLocation(this.program, attributeName),
      )
    }
    for (const uniformName of uniforms) {
      const uniformLocation = gl.getUniformLocation(this.program, uniformName)
      if (!uniformLocation) {
        continue
      }

      this.uniforms.set(uniformName, uniformLocation)
    }
  }

  destroy() {
    //TODO
  }

  use() {
    this.gl.useProgram(this.program)
  }

  private initShaderProgram(
    gl: WebGLRenderingContext,
    vsSource: string,
    fsSource: string,
  ) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)
    if (!vertexShader) {
      throw new Error('Failed to load vertex shader')
    }

    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!fragmentShader) {
      throw new Error('Failed to load fragment shader')
    }

    const shaderProgram = gl.createProgram()
    if (!shaderProgram) {
      throw new Error('Unable to create shader program')
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(
        'Unable to initialize the shader program: ' +
          gl.getProgramInfoLog(shaderProgram),
      )
    }

    return shaderProgram
  }

  private loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)
    if (!shader) {
      throw new Error('Unable to create shader')
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      throw new Error(
        'An error occurred compiling the shaders: ' +
          gl.getShaderInfoLog(shader),
      )
    }

    return shader
  }

  enableAttribute(attributeName: AttributeName) {
    if (!this.attributes.has(attributeName)) {
      throw new Error(`Attribute ${attributeName} not found`)
    }
    const attributeLocation = this.attributes.get(attributeName) as number

    this.gl.vertexAttribPointer(
      attributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    )
    this.gl.enableVertexAttribArray(attributeLocation)
  }

  private assertUniformName(name: UniformName) {
    if (!this.uniforms.has(name)) {
      throw new Error(`Uniform ${name} not found`)
    }
  }

  setUniformMatrix4v(uniformName: UniformName, buffer: Float32Array) {
    this.assertUniformName(uniformName)

    this.gl.uniformMatrix4fv(
      this.uniforms.get(uniformName) as WebGLUniformLocation,
      false,
      buffer,
    )
  }

  setUniform1i(uniformName: UniformName, value: number) {
    this.assertUniformName(uniformName)

    this.gl.uniform1i(
      this.uniforms.get(uniformName) as WebGLUniformLocation,
      value,
    )
  }
}
