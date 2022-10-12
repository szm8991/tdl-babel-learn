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
    const str1 = JSON.stringify(ast)
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
    const str2 = JSON.stringify(ast)
    expect(str1).not.toEqual(str2)
    const { code } = myGenerate(ast, sourceCode, 'foo.js')
    expect(code).toMatchInlineSnapshot(`
      "const c=1;
      const d=2;

      function add(a,b){
          
          return a+b
      }

      add(c, d)
      "
    `)
    // console.log(map)
  })
})
