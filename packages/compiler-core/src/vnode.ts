import { isArray, isFunction, isObject, isString } from '@vue/shared'
import { normalizeClass } from 'packages/shared/src/normalizeClass'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

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
  //进行props中class与style增强处理
  if (props) {
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }
  //这里
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0
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
  if (children == null) {
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
  //shapeFlag非常重要，它决定了虚拟节点的类型和子节点类型
  vnode.shapeFlag |= type
}
