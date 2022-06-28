import { PluginDefinition, NodePath, Babel } from '@babel/core'
import { CallExpression } from '@babel/types'
import generate from '@babel/generator'
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`)
export function plugin({ types, template }: Babel): PluginDefinition {
  return {
    pre(file) {
      this.cache = new Map()
    },
    visitor: {
      CallExpression(path: NodePath<CallExpression>, state) {
        if (path.node.isNew) {
          return
        }
        const calleeName = generate(path.node.callee).code
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start
          const newNode = template.expression(
            `console.log("${state.filename || 'unkown filename'}: (${line}, ${column})")`
          )()
          newNode.isNew = true

          if (path.findParent(path => path.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newNode, path.node]))
            path.skip()
          } else {
            path.insertBefore(newNode)
          }
        }
      },
    },
    post(file) {
      console.log(this.cache)
    },
  }
}
