const { declare } = require('@babel/helper-plugin-utils')
const importModule = require('@babel/helper-module-imports')

export const autoTrackPlugin = declare((api, options, dirname) => {
  api.assertVersion(7)
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get('source').node.value
              if (requirePath === options.trackerPath) {
                const specifierPath = curPath.get('specifiers.0')
                if (specifierPath.isImportSpecifier()) {
                  state.trackerImportId = specifierPath.toString()
                } else if (specifierPath.isImportNamespaceSpecifier()) {
                  state.trackerImportId = specifierPath.get('local').toString()
                } else if (specifierPath.isImportDefaultSpecifier()) {
                  state.trackerImportId = specifierPath.get('local').toString()
                  // console.log(state.trackerImportId)
                }
                curPath.stop()
              }
            },
          })
          if (!state.trackerImportId) {
            state.trackerImportId = importModule.addDefault(path, 'tracker', {
              nameHint: path.scope.generateUid('tracker'),
            }).name
            state.trackerAST = api.template.statement(`${state.trackerImportId}()`)()
          }
        },
      },
      'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
        const bodyPath = path.get('body')
        if (bodyPath.isBlockStatement()) {
          // 有函数体就在开始插入埋点代码
          bodyPath.node.body.unshift(state.trackerAST)
        } else {
          // 当然有的函数没有函数体，这种要包装一下，然后修改下 return 值
          const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({
            PREV_BODY: bodyPath.node,
          })
          bodyPath.replaceWith(ast)
        }
      },
    },
  }
})
