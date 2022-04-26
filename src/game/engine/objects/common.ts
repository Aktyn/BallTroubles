import { Vector3 } from '../../../utils'

export interface Updatable {
  shouldBeDeleted: boolean
  destroyed: boolean
  destroy(): void
  update(deltaTime: number): void
}

export enum OBJECT_TYPE {
  SMALL_BALL,
  BOX,
  PORTAL,
  HEAL_PLUS,
}

export enum OBJECT_MATERIAL {
  WOODEN_CRATE,
  ROCK_ENEMY,
  PLAYER,
  HEAL_PLUS,

  // PARTICLE MATERIALS
  SIMPLE_PARTICLE,
  STAR_PARTICLE,
  FIRE_PARTICLE,
}

export enum BACKGROUND_TEXTURE {
  NEBULA_1,
}

export const DefaultProperties: {
  [key in OBJECT_TYPE]: { scale: Vector3 }
} = {
  [OBJECT_TYPE.SMALL_BALL]: {
    scale: new Vector3(0.05, 0.05, 0.05),
  },
  [OBJECT_TYPE.BOX]: {
    scale: new Vector3(0.1, 0.1, 0.1),
  },
  [OBJECT_TYPE.PORTAL]: {
    scale: new Vector3(0.1, 0.1, 0.1),
  },
  [OBJECT_TYPE.HEAL_PLUS]: {
    scale: new Vector3(0.025 / 3, 0.025, 0.025),
  },
}

export function updateUpdatables(updatables: Updatable[], deltaTime: number) {
  for (let i = 0; i < updatables.length; i++) {
    const obj = updatables[i]

    if (obj.shouldBeDeleted) {
      obj.destroy()
    }

    if (obj.destroyed) {
      updatables.splice(i, 1)
      i--
    } else {
      obj.update(deltaTime)
    }
  }
}
