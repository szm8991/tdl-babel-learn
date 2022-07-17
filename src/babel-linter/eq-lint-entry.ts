import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { eqLintPlugin } from './plugin/babel-eq-lint-plugin'

const sourceCode = `
a == b;
foo == true
bananas != 1;
value == undefined
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})

export const { code: eqLintCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      eqLintPlugin,
      {
        fix: true,
      },
    ],
  ],
})

export { doubleEqError } from './plugin/babel-eq-lint-plugin'
