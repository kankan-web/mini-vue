export const isArray = Array.isArray

export const isObject = (val: unknown) => {
  return val !== null && typeof val === 'object'
}
//判断值是否发生变化
export const hasChanged = (value: any, newValue: any): boolean => {
  return !Object.is(value, newValue)
}
