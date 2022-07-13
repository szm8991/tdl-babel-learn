import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { autoI18nPlugin } from './plugin'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8',
})

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
})

export const { code: autoI18nPluginCode } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoI18nPlugin,
      {
        outputDir: path.resolve(__dirname, './output'),
      },
    ],
  ],
})
// console.log(autoI18nPluginCode)
export { shouldNotI18n } from './plugin'
