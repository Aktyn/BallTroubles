/* eslint-disable @typescript-eslint/ban-types */
import { ObjectBase } from '../objects/objectBase'

export function objectsAreInstancesOf<
  Class1Type extends abstract new (...args: never) => object,
  Class2Type extends abstract new (...args: never) => object,
>(
  objA: ObjectBase,
  objB: ObjectBase,
  Class1: Class1Type,
  Class2: Class2Type,
  callback: (
    obj1: InstanceType<Class1Type>,
    obj2: InstanceType<Class2Type>,
  ) => void,
) {
  if (objA instanceof Class1 && objB instanceof Class2) {
    callback(objA as never, objB as never)
  } else if (objA instanceof Class2 && objB instanceof Class1) {
    callback(objB as never, objA as never)
  }
}
