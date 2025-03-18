export const enum ShapeFlags {
  //元素
  ELEMENT = 1,
  //函数组件
  FUNCTIONAL_COMPONENT = 1 << 1,
  //有状态组件
  STATEFUL_COMPONENT = 1 << 2,
  //children：text 文本子节点
  TEXT_CHILDREN = 1 << 3,
  //children：array 数组子节点
  ARRAY_CHILDREN = 1 << 4,
  //children：slots 插槽子节点
  SLOTS_CHILDREN = 1 << 5,
  //传送门
  TELEPORT = 1 << 6,
  //Suspense组件
  SUSPENSE = 1 << 7,
  //keep-alive组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  //keep-alive组件
  COMPONENT_KEPT_ALIVE = 1 << 9,
  //组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
