import Box2D from '@cocos/box2d'
import { mix, SECOND, Vector3, Vector2 } from '../../../../utils'
import { SimpleBullet } from '../bullets/simpleBullet'
import { DefaultProperties, OBJECT_MATERIAL, OBJECT_TYPE } from '../common'
import { DynamicObject } from '../dynamicObject'
import { Player } from '../player'
import { EffectBase } from './effectBase'

const initialScale = DefaultProperties[OBJECT_TYPE.GUN1].scale
const targetScale = DefaultProperties[OBJECT_TYPE.SMALL_BALL].scale

export class GunEffect extends EffectBase {
  private static ROTATION_SPEED = 0.5
  private static DURATION = 60 * SECOND
  private static SCALING_SPEED = 1
  private static FIRE_FREQUENCY = 200
  private static BULLET_OFFSET = 0.15
  private static BULLET_SIDE_OFFSET = 0.021

  private readonly eventListeners = {
    onKeyDown: this.onKeyDown.bind(this),
    onKeyUp: this.onKeyUp.bind(this),
  }

  private timer = 0
  private targetPlayer: Player | null = null
  private transitionFactor = 0
  private isFiring = false
  private firingTimer = GunEffect.FIRE_FREQUENCY

  constructor(pos: Vector3, world: Box2D.World) {
    super(pos, world, {
      icon: require('../../../../assets/textures/effects/gunIcon.png'),
      type: OBJECT_TYPE.GUN1,
      material: OBJECT_MATERIAL.GUN1,
    })

    this.setupEventListeners()
  }

  destroy() {
    this.removeEventListeners()
    super.destroy()
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.eventListeners.onKeyDown)
    window.addEventListener('keyup', this.eventListeners.onKeyUp)
  }

  private removeEventListeners() {
    window.removeEventListener('keydown', this.eventListeners.onKeyDown)
    window.removeEventListener('keyup', this.eventListeners.onKeyUp)
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.isFiring = true
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.isFiring = false
    }
  }

  applyEffect(target: DynamicObject) {
    if (this.targetPlayer) {
      return
    }
    if (target instanceof Player) {
      for (const activeEffect of target.getActiveEffects()) {
        if (activeEffect.effect instanceof GunEffect) {
          return
        }
      }
      this.targetPlayer = target
      this.targetPlayer.registerEffect(this, GunEffect.DURATION)
      this.timer = 0
      this.firingTimer = GunEffect.FIRE_FREQUENCY
    }
  }

  private fire() {
    const angle = this.angle + Math.PI

    const posForward = this.position
      .copy()
      .add(
        Math.cos(angle) * GunEffect.BULLET_OFFSET,
        Math.sin(angle) * GunEffect.BULLET_OFFSET,
        0,
      )

    const sideVector = new Vector3(
      Math.cos(angle + Math.PI / 2),
      Math.sin(angle + Math.PI / 2),
      0,
    ).scale(GunEffect.BULLET_SIDE_OFFSET)

    const bulletLeft = new SimpleBullet(
      posForward.copy().addV(sideVector),
      angle,
      this.world,
    )
    const bulletRight = new SimpleBullet(
      posForward.copy().subtractV(sideVector),
      angle,
      this.world,
    )

    this.children.push(bulletLeft, bulletRight)
  }

  private morphPosition() {
    if (!this.targetPlayer) {
      return
    }

    this._scale.set(
      mix(initialScale.x, targetScale.x, this.transitionFactor),
      mix(initialScale.y, targetScale.y, this.transitionFactor),
      mix(initialScale.z, targetScale.z, this.transitionFactor),
    )
    const smoothAngle = new Vector2(Math.cos(this.angle), Math.sin(this.angle))
      .lerp(
        new Vector2(
          Math.cos(this.targetPlayer.angle + Math.PI),
          Math.sin(this.targetPlayer.angle + Math.PI),
        ),
        this.transitionFactor,
      )
      .toAngle()
    super.setAngle(smoothAngle)

    super.setPosition(
      new Vector3(
        mix(
          this.position.x,
          this.targetPlayer.position.x,
          this.transitionFactor,
        ),
        mix(
          this.position.y,
          this.targetPlayer.position.y,
          this.transitionFactor,
        ),
        mix(
          this.position.z,
          this.targetPlayer.position.z,
          this.transitionFactor,
        ),
      ),
    )
  }

  update(deltaTime: number) {
    if (this.targetPlayer) {
      this.timer += deltaTime
      if (this.timer * SECOND > GunEffect.DURATION) {
        this.shouldBeDeleted = true
        this.targetPlayer.unregisterEffect(this)
        this.targetPlayer = null
        this.isFiring = false
      } else if (this.transitionFactor < 1) {
        this.transitionFactor = Math.min(
          1,
          this.transitionFactor + deltaTime * GunEffect.SCALING_SPEED,
        )

        this.morphPosition()
      } else {
        const playerVelocity = this.targetPlayer.getLinearVelocity()
        super.setAngle(Math.atan2(playerVelocity.y, playerVelocity.x) + Math.PI)
        super.setPosition(this.targetPlayer.position)

        this.firingTimer += deltaTime * SECOND

        if (this.isFiring && this.firingTimer >= GunEffect.FIRE_FREQUENCY) {
          this.firingTimer = 0
          this.fire()
        }
      }
    } else {
      super.setAngle(
        this.angle - Math.PI * deltaTime * GunEffect.ROTATION_SPEED,
      )
    }
    super.updateRenderer(null)

    return super.update(deltaTime)
  }
}
