import { extend } from '@vue/shared'
import { patchProp } from './patchProps'
import { nodeOps } from './nodeOps'
import { createRenderer } from '@vue/runtime-core'

const rendererOptions = extend({ patchProp }, nodeOps)

let renderer
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
//MARK：导出render的逻辑，很巧妙
export const render = (...args) => {
  ensureRenderer().render(...args)
}
