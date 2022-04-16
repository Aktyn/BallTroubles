import { Vector3 } from '../../../utils'

export enum OBJECT_TYPE {
  SMALL_BALL,
  BOX,
  GROUND_BOX,
}

export enum OBJECT_MATERIAL {
  WOODEN_CRATE,
  ENEMY_BALL,

  // PARTICLE MATERIALS
  STAR_PARTICLE,
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
  [OBJECT_TYPE.GROUND_BOX]: {
    scale: new Vector3(2, 2, 0.1),
  },
}
