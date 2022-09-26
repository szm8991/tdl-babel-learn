import fs from 'fs'

import * as parser from '@babel/parser'
import traverse from '@babel/traverse'

import getRequirePath from './helper'

import type { NodePath } from '@babel/traverse'
import { ExportSpecifier, Identifier } from '@babel/types'
import { DependencyNode, EXPORT_TYPE, IMPORT_TYPE } from './type'

export function getDependencyGraph(rootPath: string) {
  const dependencyGraph = {
    root: new DependencyNode(),
    subModules: {},
  }
  const visitedModules: Set<string> = new Set()
  // 从入口路径开始处理当前文件
  traverseModule(rootPath, dependencyGraph.root, visitedModules, dependencyGraph.subModules)
  return dependencyGraph
}

export function traverseModule(
  curModulePath: string,
  dependencyNode: DependencyNode,
  visitedModules: Set<string>,
  resultModules: Record<string, any>
) {
  // 分析文件AST中的import和export词法
  const moduleContent = fs.readFileSync(curModulePath, {
    encoding: 'utf-8',
  })
  // 记录当前文件路径
  dependencyNode.path = curModulePath

  const ast = parser.parse(moduleContent, {
    sourceType: 'unambiguous',
    plugins: resolveBabelSyntaxtPlugins(curModulePath),
  })

  traverse(ast, {
    ImportDeclaration(path) {
      // 得到子依赖的路径
      const subModulePath = getRequirePath(curModulePath, path.node.source.value, visitedModules)
      if (!subModulePath) return
      // 得到子依赖的导入说明符
      const specifierPaths = path.get('specifiers')

      dependencyNode.imports[subModulePath] = specifierPaths.map(specifierPath => {
        if (specifierPath.isImportSpecifier()) {
          return {
            type: IMPORT_TYPE.deconstruct,
            imported: (specifierPath.get('imported') as NodePath<Identifier>).node.name,
            local: specifierPath.get('local').node.name,
          }
        } else if (specifierPath.isImportDefaultSpecifier()) {
          return {
            type: IMPORT_TYPE.default,
            local: specifierPath.get('local').node.name,
          }
        } else {
          return {
            type: IMPORT_TYPE.namespace,
            local: specifierPath.get('local').node.name,
          }
        }
      })
      // 递归处理子节点
      const subModule = new DependencyNode()
      traverseModule(subModulePath, subModule, visitedModules, resultModules)
      dependencyNode.subModules[subModulePath] = subModule
    },
    ExportDeclaration(path) {
      if (path.isExportNamedDeclaration()) {
        const specifierPaths = path.get('specifiers') as NodePath<ExportSpecifier>[]

        dependencyNode.exports = specifierPaths.map(specifierPath => {
          return {
            type: EXPORT_TYPE.named,
            exported: (specifierPath.get('exported') as NodePath<Identifier>).node.name,
            local: specifierPath.get('local').node.name,
          }
        })
      } else if (path.isExportDefaultDeclaration()) {
        let exportName
        const declarationPath = path.get('declaration')
        if (declarationPath.isAssignmentExpression()) {
          exportName = declarationPath.get('left').toString()
        } else {
          exportName = declarationPath.toString()
        }
        dependencyNode.exports.push({
          type: EXPORT_TYPE.default,
          exported: exportName,
        })
      } else if (path.isExportAllDeclaration()) {
        dependencyNode.exports.push({
          type: EXPORT_TYPE.all,
          exported: '*',
          source: path.get('source').node.value,
        })
      }
    },
  })

  resultModules[curModulePath] = dependencyNode
}

function resolveBabelSyntaxtPlugins(modulePath: string) {
  const plugins: parser.ParserPlugin[] = []
  if (['.tsx', '.jsx'].some(ext => modulePath.endsWith(ext))) {
    plugins.push('jsx')
  }
  if (['.ts', '.tsx'].some(ext => modulePath.endsWith(ext))) {
    plugins.push('typescript')
  }
  return plugins
}
