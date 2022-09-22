import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { basicFuncChecker } from './plugin/babel-func-checker-plugin'
export { funcError } from './plugin/babel-func-checker-plugin'
const sourceCode = `
function add(a: number, b: number): number{
    return a + b;
}
add(1, '2');
function sum<T>(a: T, b: T) {
    return a * b;
}
add<number>(1, '2');
type Res<Param> = Param extends 1 ? number : string;
function doubleAdd<T>(a: T, b: T) {
    return 2 * (a + b);
}
doubleAdd<Res<2>>(1, '2');
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
