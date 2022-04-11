import { isPowerOf2 } from 'utils'

export class WebGLTextureEx {
  private readonly gl: WebGLRenderingContext
  private readonly texture: WebGLTexture

  constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
    this.gl = gl
    this.texture = this.load(image)
  }

  private load(image: HTMLImageElement) {
    const texture = this.gl.createTexture()
    if (!texture) {
      throw new Error('Failed to create texture')
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image,
    )

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Generate mipmap
      this.gl.generateMipmap(this.gl.TEXTURE_2D)
    } else {
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE,
      )
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE,
      )
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR,
      )
    }

    console.log(`Loaded webgl texture: ${image.src}`)

    return texture
  }

  bind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
  }
}
