import { ObjectBase, CommonObjectProperties } from './objectBase'

export class GhostObject extends ObjectBase {
  constructor(properties: CommonObjectProperties) {
    super({ ...properties, static: true })
  }
}
