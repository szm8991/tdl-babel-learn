import { describe, expect, it } from 'vitest'
import { myParse, myTraverse, myGenerate } from '../../src'

describe('should', () => {
  it('basic babel function', () => {
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
    const { code, map } = myGenerate(ast, sourceCode, 'dist.js')
    expect(code).toMatchInlineSnapshot(`
      "const c=1;
      const d=2;

      function add(a,b){
          
          return a+b
      }

      add(c, d)
      "
    `)
    expect(map).toMatchInlineSnapshot('"{\\"version\\":3,\\"sources\\":[\\"dist.js\\"],\\"names\\":[],\\"mappings\\":\\"AAAA,AACQ,CAAM,CAAI;AACV,CAAM,CAAI;;AAGV;AAAmB;IAEf,AAAO,AAAI;;;AAEf,AAAI,AAAG\\",\\"file\\":\\"dist.js.map.json\\",\\"sourcesContent\\":[\\"\\\\n        const c = 1\\\\n        const d = 2\\\\n        const e = 4\\\\n\\\\n        function add(a, b) {\\\\n            const tmp = 1\\\\n            return a + b\\\\n        }\\\\n        add(c, d)\\\\n    \\"]}"')
  })
})
