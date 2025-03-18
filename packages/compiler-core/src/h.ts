import { isArray, isObject } from '@vue/shared'
import { VNode, createVNode, isVNode } from './vnode'

/**
 * 创建虚拟节点
 * @param type
 * @param propsOrChildren
 * @param children
 * @returns
 * @example
 *
 *
 */
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    //propsOrChildren 是对象，不是数组
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      //propsOrChildren 是虚拟节点
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      return createVNode(type, propsOrChildren, [])
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
