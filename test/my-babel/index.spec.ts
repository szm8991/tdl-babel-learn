import { describe, expect, it } from 'vitest'
import { myParse, myTraverse, myGenerate } from '../../src'

describe('should', () => {
  it('parse', () => {
    const sourceCode = `
        const c = 1
        const d = 2
        const e = 4

        function add(a, b) {
            const tmp = 1
            return a + b
        }
        add(c, d)
    `
    const ast = myParse(sourceCode, { ecmaVersion: 'latest', plugins: ['literal'] })
    myTraverse(ast, {
      Program(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]: any[]) => {
          if (!binding.referenced) {
            binding.path.remove()
          }
        })
      },
      FunctionDeclaration(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]: any[]) => {
          if (!binding.referenced) {
            binding.path.remove()
          }
        })
      },
    })
    // const { code, map } = myGenerate(ast, sourceCode, 'foo.js')
    // console.log(code)
    // console.log(map)
  })
})
