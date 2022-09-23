import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { manglePlugin } from './plugin/babel-code-mangle-plugin'
import { compressPlugin } from './plugin/babel-code-compress-plugin'
const sourceCode = `
    function func() {
        const num1 = 1;
        const num2 = 2;
        const num3 = /*@SZM_PURE@*/add(1, 2);
        const num4 = add(3, 4);
        console.log(num2);
        return num2;
        console.log(num1);
        function add (aaa, bbb) {
            return aaa + bbb;
        }
    }
    func();
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  attachComment: true,
})
export const { code: mangleCompressCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [[manglePlugin], [compressPlugin]],
  generatorOpts: {
    comments: false,
  },
})
