// import { transformFileSync } from '@babel/core'
// import path, { dirname } from 'node:path'
// import { fileURLToPath } from 'node:url'
// const __dirname = dirname(fileURLToPath(import.meta.url))
const { transformFileSync } = require('@babel/core')
const path = require('path')

const sourceFilePath = path.resolve(__dirname, './sourceCode.js')

const { code } = transformFileSync(sourceFilePath, {
  plugins: [['babel-plugin-macros']],
})

console.log(code)
