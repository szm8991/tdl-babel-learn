import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { forDirectionLintPlugin } from './plugin/babel-for-direction-lint-plugin'

const sourceCode = `
for (var i = 0; i < 10; i++) {
}

for (var i = 10; i >= 0; i--) {
}
for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})

export const { code: forDirectionLintCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [forDirectionLintPlugin],
  filename: 'input.js',
})

export { forDirError, forDirectionLintError } from './plugin/babel-for-direction-lint-plugin'
