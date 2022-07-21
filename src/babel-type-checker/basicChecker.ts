import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { basicChecker } from './plugin/babel-basic-checker-plugin'
const sourceCode = `
let name: string;
name = 111;
let age: number = 'szm';
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['typescript'],
})

export const { code: basicCheckerCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      basicChecker,
      {
        fix: true,
      },
    ],
  ],
})
