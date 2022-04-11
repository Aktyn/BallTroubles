export enum b2BodyType {
  b2_unknown = -1,
  b2_staticBody = 0,
  b2_kinematicBody = 1,
  b2_dynamicBody = 2,

  // TODO_ERIN
  // b2_bulletBody = 3
}

export const PhysicsParameters = {
  SCALAR: 10,
} as const
