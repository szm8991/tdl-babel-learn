import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { autoDocPlugin } from './plugin'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.ts'), {
  encoding: 'utf-8',
})

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['typescript'],
})

export const { code: autoDocsCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoDocPlugin,
      {
        outputDir: path.resolve(__dirname, './docs'),
        format: 'markdown', // html / json
      },
    ],
  ],
})
export { docs } from './plugin'
