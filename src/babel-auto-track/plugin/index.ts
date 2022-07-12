import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import { autoTrackPlugin } from './plugin'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sourceCode = fs.readFileSync(path.join(__dirname, '../sourceCode.js'), {
  encoding: 'utf-8',
})

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})

export const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoTrackPlugin,
      {
        trackerPath: 'tracker',
      },
    ],
  ],
})

// console.log(code)
