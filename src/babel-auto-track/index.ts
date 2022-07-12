// import { transformFromAstSync } from '@babel/core'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import types from '@babel/types'
import template from '@babel/template'
import importModule from '@babel/helper-module-imports'
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
export let enterTime = 0
export let importDeclarationVisitTime = 0
export let importFunctionVisitTime = 0
const trackerPath = 'tracker'
traverse(
  ast,
  {
    // 每个节点enter时都调用这个visitor函数
    enter(path, state) {
      enterTime++
      path.traverse({
        ImportDeclaration(curPath) {
          importDeclarationVisitTime++
          const requirePath = curPath.get('source').node.value
          // console.log(requirePath, trackerPath, requirePath === trackerPath)
          if (requirePath === trackerPath) {
            // 如果已经引入了trakcer
            const specifierPath = curPath.get('specifiers.0')
            // console.log(specifierPath.isImportDefaultSpecifier())
            if (specifierPath.isImportSpecifier()) {
              state.trackerImportId = specifierPath.toString()
              // console.log(state.trackerImportId)
            } else if (specifierPath.isImportNamespaceSpecifier()) {
              state.trackerImportId = specifierPath.get('local').toString()
              // console.log(state.trackerImportId)
            } else if (specifierPath.isImportDefaultSpecifier()) {
              state.trackerImportId = specifierPath.get('local').toString()
              // console.log(state.trackerImportId)
            }
            // 终止当前path的遍历
            curPath.stop()
          }
        },
      })
      if (!state.trackerImportId) {
        // console.log(state.trackerImportId)
        state.trackerImportId = importModule.addDefault(path, 'tracker', {
          nameHint: path.scope.generateUid('tracker'),
        }).name
      }
      state.trackerAST = template.statement(`${state.trackerImportId}()`)()
    },
    'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
      importFunctionVisitTime++
      const bodyPath = path.get('body')
      if (bodyPath.isBlockStatement()) {
        // console.log(1)
        bodyPath.node.body.unshift(state.trackerAST)
      } else {
        // console.log(2)
        const ast = template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({
          PREV_BODY: bodyPath.node,
        })
        bodyPath.replaceWith(ast)
      }
    },
  },
  // scope
  {},
  // state
  {}
)

export const { code: autoTrackCode } = generate(ast)

export { code as autoTrackPluginCode } from './plugin'
