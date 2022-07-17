import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { forDirectionLintPlugin } from './plugin/babel-for-direction-lint-plugin'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))

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

export { forDirError } from './plugin/babel-for-direction-lint-plugin'
