import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

// 缓存代理对象
export const reactiveMap = new WeakMap<object, any>()

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  // 如果 target 已经是代理对象，则直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 创建代理对象
  const proxy = new Proxy(target, baseHandlers)

  // 缓存代理对象
  proxyMap.set(target, proxy)
  return proxy
}

export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as object) : value
}
