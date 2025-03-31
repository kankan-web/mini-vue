import { Comment, Fragment, Text } from '@vue/compiler-core'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

export interface RendererOptions {
  //为指定的element的props打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  //为指定的Element 设置text
  setElementText(el: Element, text: string): void
  //为指定的Element 添加element
  insert(el, parent: Element, anchor?): void
  //为指定的Element 创建element
  createElement(type: string)
}
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}
function baseCreateRenderer(options: RendererOptions): any {
  const {
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    insert: hostInsert,
    createElement: hostCreateElement
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      mountElement(newVNode, container, anchor) //挂载操作
    } else {
      //TODO:更新操作
    }
  }
  //挂载操作：
  const mountElement = (vnode, container, anchor) => {
    const { type, props, shapeFlag } = vnode
    //1.创建element
    const el = (vnode.el = hostCreateElement(type))
    if (shapeFlag && ShapeFlags.TEXT_CHILDREN) {
      //2.设置文本
      hostSetElementText(el, vnode.children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    }
    //3.设置props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    //4.插入
    hostInsert(el, container, anchor)
  }
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode == newVNode) {
      return
    }
    const { type, shapeFlag } = newVNode
    switch (type) {
      case Text:
        break
      case Comment:
        break
      case Fragment:
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
        }
    }
  }
  const render = (vnode, container) => {
    if (vnode === null) {
      //TODO：卸载
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  return {
    render
  }
}
