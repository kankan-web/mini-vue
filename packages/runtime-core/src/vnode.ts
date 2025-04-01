import { VNode } from 'packages/compiler-core/src/vnode'

export function isSameVNodeType(n1: VNode, n2: VNode) {
  return n1.type === n2.type && n1.key === n2.key
}
