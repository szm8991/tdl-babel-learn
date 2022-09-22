import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { basicFuncChecker } from './plugin/babel-func-checker-plugin'
const sourceCode = `
function add(a: number, b: number): number{
    return a + b;
}
add(1, '2');
`
const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['typescript'],
})

export const { code: funcCheckerCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      basicFuncChecker,
      {
        fix: true,
      },
    ],
  ],
})
