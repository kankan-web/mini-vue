import { isArray, isFunction, isString } from '@vue/shared'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

export interface VNode {
  __v_isVNode: boolean
  type: any
  props: any
  children: any
  shapeFlag: number
}
export function isVNode(value: any): value is VNode {
  return value && value.__v_isVNode === true
}

export function createVNode(type, props, children): VNode {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  return createBaseVNode(type, props, children, shapeFlag)
}
function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    shapeFlag
  } as VNode

  //TEXT: 处理 children
  normalizeChildren(vnode, children)

  return vnode
}

function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children === null) {
    children = null
  } else if (isArray(children)) {
    //children 是数组
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    //children 是对象
  } else if (isFunction(children)) {
    //children 是函数
  } else {
    //children 是字符串
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  //MARK: 为什么需要用或运算符?
  vnode.shapeFlag |= type
}
