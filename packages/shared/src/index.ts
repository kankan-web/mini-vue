export const isArray = Array.isArray

export const isObject = (val: unknown) => {
  return val !== null && typeof val === 'object'
}
export const isString = (val: unknown): val is string => typeof val === 'string'

//判断值是否发生变化
export const hasChanged = (value: any, newValue: any): boolean => {
  return !Object.is(value, newValue)
}
//判断是否为函数
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
