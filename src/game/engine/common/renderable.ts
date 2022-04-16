interface RendererSynchronizerOptions<UpdateData> {
  onUpdate: (data: UpdateData) => void
  onRemoved: () => void
}

export abstract class Renderable<
  UpdateData extends Renderable<never> | object | null,
> {
  private synchronizedWithRenderer = false
  private rendererSynchronizerOptions: Partial<
    RendererSynchronizerOptions<UpdateData>
  > = {}

  destroy() {
    this.rendererSynchronizerOptions.onRemoved?.()
  }

  updateRenderer(data: UpdateData) {
    this.rendererSynchronizerOptions.onUpdate?.(data)
  }

  isSynchronizedWithRenderer() {
    return this.synchronizedWithRenderer
  }

  synchronizeWithRenderer(
    options: Partial<RendererSynchronizerOptions<UpdateData>> = {},
  ) {
    this.rendererSynchronizerOptions = options
    this.synchronizedWithRenderer = true
  }
}
