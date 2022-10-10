// import { createMacro } from 'babel-plugin-macros'
// import fs from 'node:fs'
// import path from 'node:path'
const { createMacro } = require('babel-plugin-macros')
const path = require('path')
const fs = require('fs')

function logMacro({ references, state, babel }) {
  // references：调用该 macro 的 ast 的 path 数组
  // state： macro 之间传递数据的方式，能拿到 filename
  // babel：各种 api，和 babel plugin 的第一个参数一样。
  const { default: referredPaths = [] } = references

  referredPaths.forEach(referredPath => {
    // 目标文件夹路径
    const dirPath = path.join(
      path.dirname(state.filename),
      referredPath.parentPath.get('arguments.0').node.value
    )
    // 获取文件夹下所有文件名
    const fileNames = fs.readdirSync(dirPath)
    // 以字符串形式生成ast
    const ast = babel.types.arrayExpression(
      fileNames.map(fileName => babel.types.stringLiteral(fileName))
    )
    referredPath.parentPath.replaceWith(ast)
  })
}

// export const fileMacro = createMacro(logMacro)

module.exports = createMacro(logMacro)
