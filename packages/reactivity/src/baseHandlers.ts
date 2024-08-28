import { track, trigger } from './effect'

const get = createGetter()
//MARK:为什么要用这样的形式写？直接get函数不就可以了嘛
function createGetter() {
  return function get(target: object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    track(target, key)
    return res
  }
}

const set = createSetter()
function createSetter() {
  return function set(
    target: object,
    key: string | symbol,
    value: any,
    receiver: object
  ) {
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return res
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
}
