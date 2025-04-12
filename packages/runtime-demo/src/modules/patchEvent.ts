export function patchEvent(
  el: Element & { _vei?: Object },
  rawName: string,
  prevValue,
  nextValue
) {
  const invokers = el._vei || (el._vei = {})
  const existingInvoker = invokers[rawName] //查看当前事件是否已经被绑定过
  // 如果存在，则更新
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue
  } else {
    const name = parseName(rawName)
    //如果不存在，则创建
    if (nextValue) {
      const invoker = (invokers[rawName] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
      // 如果存在，则移除
    } else if (existingInvoker) {
      el.removeEventListener(name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}
function parseName(name: string) {
  return name.slice(2).toLowerCase()
}
function createInvoker(initialValue) {
  const invoker = (e: Event) => {
    invoker.value && invoker.value()
  }
  invoker.value = initialValue
  return invoker
}
