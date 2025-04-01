import { Comment, Fragment, Text } from '@vue/compiler-core'
import { EMPTY_OBJ } from '@vue/shared'
import { patchProp } from 'packages/runtime-demo/src/patchProps'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { isSameVNodeType } from './vnode'

export interface RendererOptions {
  //为指定的element的props打补丁
  patchProp(el: Element, key: string, prevValue: any, nextValue: any): void
  //为指定的Element 设置text
  setElementText(el: Element, text: string): void
  //为指定的Element 添加element
  insert(el, parent: Element, anchor?): void
  //为指定的Element 创建element
  createElement(type: string)
  //移除指定的element
  remove(el: Element): void
}
export function createRenderer(options: RendererOptions) {
  return baseCreateRenderer(options)
}
function baseCreateRenderer(options: RendererOptions): any {
  const {
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    insert: hostInsert,
    createElement: hostCreateElement,
    remove: hostRemove
  } = options

  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      mountElement(newVNode, container, anchor) //挂载操作
    } else {
      //更新操作
      patchElement(oldVNode, newVNode)
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
  //更新操作
  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el)
    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ

    patchChildren(oldVNode, newVNode, el)
    patchProps(el, newVNode, oldProps, newProps)
  }
  const patchChildren = (oldVNode, newVNode, container) => {
    const c1 = oldVNode && oldVNode.children
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    const c2 = newVNode && newVNode.children
    const { shapeFlag } = newVNode
    //新节点的类型为text
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //旧节点的类型为Array children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //TODO:卸载旧节点
      }
      if (c2 !== c1) {
        //挂载新节点的文本
        hostSetElementText(container, c2)
      }
    } else {
      //新节点的类型不为text
      //旧节点的类型也为Array children
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //旧节点也为Array children
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //TODO:diff
        } else {
          //TODO:卸载
        }
      } else {
        //旧节点
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //TODO:单独新子节点的挂载
        }
      }
    }
  }
  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    //这里是以新值的props为主，但是不同内容的props做个替换
    //比如：都是class类型，但是旧值是：test，新值是：active
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }
    }
    //若旧值中存在，但是新值中未存在的，可以将旧值移除
    if (oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }
  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode == newVNode) {
      return
    }
    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      unmount(oldVNode)
      oldVNode = null
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
  const unmount = (vnode) => {
    hostRemove(vnode.el)
  }
  const render = (vnode, container) => {
    if (vnode === null) {
      //卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  return {
    render
  }
}
