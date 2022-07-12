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
                  console.log(state.trackerImportId)
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
          // console.log(1)
          bodyPath.node.body.unshift(state.trackerAST)
        } else {
          // console.log(2)
          const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({
            PREV_BODY: bodyPath.node,
          })
          bodyPath.replaceWith(ast)
        }
      },
    },
  }
})
