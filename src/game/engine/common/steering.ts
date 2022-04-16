export abstract class Steering {
  left = false
  right = false

  abstract destroy(): void
}

export class KeyboardSteering extends Steering {
  private readonly eventListeners = {
    onKeyDown: this.handleKeyDown.bind(this),
    onKeyUp: this.handleKeyUp.bind(this),
  }

  constructor() {
    super()

    this.setupListeners()
  }

  destroy() {
    window.removeEventListener('keydown', this.eventListeners.onKeyDown)
    window.removeEventListener('keyup', this.eventListeners.onKeyUp)
  }

  private setupListeners() {
    window.addEventListener('keydown', this.eventListeners.onKeyDown)
    window.addEventListener('keyup', this.eventListeners.onKeyUp)
  }

  private handleKey(code: string, down: boolean) {
    switch (code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.left = down
        break
      case 'ArrowRight':
      case 'KeyD':
        this.right = down
        break
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.handleKey(event.code, true)
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.handleKey(event.code, false)
  }
}
