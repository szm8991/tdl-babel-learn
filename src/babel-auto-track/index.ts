import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8',
})
// console.log(sourceCode)

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})
