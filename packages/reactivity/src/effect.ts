import { createDep, Dep } from './dept'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<object, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
//用于存储当前的实例
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    activeEffect = this
    return this.fn()
  }
}
/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  //[ ]:如何让一个key对应多个effect？
  // depsMap.set(key, activeEffect)
  //[x]:将activeEffect收集到set中
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}
/**
 * 利用dep依次跟踪key的所有effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}
/**
 * 触发依赖
 * @param target
 * @param key
 */
export function trigger(target: object, key: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effect = depsMap.get(key) as Dep
  if (!effect) return
  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) return
  triggerEffects(dep)
}
/**
 * 依次触发dep中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : Array.from(dep)
  //依次触发依赖
  for (const effect of effects) {
    triggerEffect(effect)
  }
}
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
