import { Vector3 } from '../../../utils'
import { Renderable } from '../common/renderable'

export interface Updatable {
  shouldBeDeleted: boolean
  destroyed: boolean
  destroy(): void
  update(deltaTime: number): Renderable<never>[] | void
}

export enum OBJECT_TYPE {
  SMALL_BALL,
  BOX,
  PORTAL,
  HEAL_PLUS,
  GUN1,
  SIMPLE_BULLET,
}

export enum OBJECT_MATERIAL {
  WOODEN_CRATE,
  ROCK_ENEMY,
  PLAYER,
  HEAL_PLUS,
  GUN1,
  SIMPLE_BULLET,

  // PARTICLE MATERIALS
  SIMPLE_PARTICLE,
  STAR_PARTICLE,
  FIRE_PARTICLE,
  HEAL_PARTICLE,
}

/** Values must not overlap with OBJECT_MATERIAL */
export enum SPRITE_MATERIAL {
  HEALTH_BAR = 10000,
}

/** No more than 0x1 << 15 */
export const COLLISION_MASKS = {
  ALL: 0xffff,
  DEFAULT: 0x1 << 0,
  PLAYER: 0x1 << 1,
  // BULLET: 0x1 << 2,
} as const

export enum BACKGROUND_TEXTURE {
  NEBULA_1,
}

const effectItemScale = 0.025
const basicItemScale = 0.1

export const DefaultProperties: {
  [key in OBJECT_TYPE]: { scale: Vector3 }
} = {
  [OBJECT_TYPE.SMALL_BALL]: {
    scale: new Vector3(0.05, 0.05, 0.05),
  },
  [OBJECT_TYPE.BOX]: {
    scale: new Vector3(basicItemScale, basicItemScale, basicItemScale),
  },
  [OBJECT_TYPE.PORTAL]: {
    scale: new Vector3(basicItemScale, basicItemScale, basicItemScale),
  },
  [OBJECT_TYPE.HEAL_PLUS]: {
    scale: new Vector3(effectItemScale / 3, effectItemScale, effectItemScale),
  },
  [OBJECT_TYPE.GUN1]: {
    scale: new Vector3(effectItemScale, effectItemScale, effectItemScale),
  },
  [OBJECT_TYPE.SIMPLE_BULLET]: {
    scale: new Vector3(
      effectItemScale,
      effectItemScale / 3,
      effectItemScale / 3,
    ),
  },
}

export function updateUpdatables(updatables: Updatable[], deltaTime: number) {
  const nonSynchronized: Renderable<never>[] = []
  for (let i = 0; i < updatables.length; i++) {
    const obj = updatables[i]

    if (obj.shouldBeDeleted) {
      obj.destroy()
    }

    if (obj.destroyed) {
      updatables.splice(i, 1)
      i--
    } else {
      if (obj instanceof Renderable && !obj.isSynchronizedWithRenderer()) {
        nonSynchronized.push(obj)
      }
      const nonSynchronizedChildren = obj.update(deltaTime)
      if (nonSynchronizedChildren?.length) {
        nonSynchronized.push(...nonSynchronizedChildren)
      }
    }
  }
  return nonSynchronized
}
