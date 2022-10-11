import { helper } from '../helper'
const { visitorKeys } = helper
import { NodePath } from './path'

export function myTraverse(node, visitors, parent?, parentPath?, key?, listKey?) {
  const defination = visitorKeys.get(node.type)
  let visitorFuncs = visitors[node.type] || {}

  if (typeof visitorFuncs === 'function') {
    visitorFuncs = {
      enter: visitorFuncs,
    }
  }
  const path = new NodePath(node, parent, parentPath, key, listKey)
  // enter阶段hooks
  visitorFuncs.enter && visitorFuncs.enter(path)

  if (node.__shouldSkip) {
    delete node.__shouldSkip
    return
  }

  if (defination.visitor) {
    // visitor: ['id', 'init']
    defination.visitor.forEach(key => {
      const prop = node[key]
      // "body": [Node1,Node2]
      if (Array.isArray(prop)) {
        prop.forEach((childNode, index) => {
          myTraverse(childNode, visitors, node, path, key, index)
        })
      } else {
        myTraverse(prop, visitors, node, path, key)
      }
    })
  }
  // exit阶段hooks
  visitorFuncs.exit && visitorFuncs.exit(path)
}
