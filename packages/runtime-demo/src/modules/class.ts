export function patchClass(el: Element, value: string | null) {
  if (value === null) {
    el.removeAttribute('class')
  } else {
    //MARK：为什么这里不用setAttribute?
    el.className = value
  }
}
