import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { noFuncAssignLintPlugin } from './plugin/babel-no-func-assign-lint-plugin'

const sourceCode = `
    function foo() {
        foo = bar;
    }

    var a = function hello() {
    hello = 123;
    };
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})

export const { code: noFuncAssignLintCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [noFuncAssignLintPlugin],
  filename: 'input.js',
})

export { noFuncAssignError } from './plugin/babel-no-func-assign-lint-plugin'
