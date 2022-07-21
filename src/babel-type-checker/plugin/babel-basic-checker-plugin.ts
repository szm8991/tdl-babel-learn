import { declare } from '@babel/helper-plugin-utils'
const tsTypeAnnotationMap = {
  TSStringKeyword: 'string',
  TSNumberKeyword: 'number',
}
function resolveTSType(targetType) {
  switch (targetType.type) {
    case 'TSTypeAnnotation':
      return tsTypeAnnotationMap[targetType.typeAnnotation.type]
    case 'NumberTypeAnnotation':
      return 'number'
  }
}
function resolveJSType(type) {
  switch (type) {
    case 'StringLiteral':
      return 'string'
    case 'NumberLiteral':
      return 'number'
  }
}

function noStackTraceWrapper(cb) {
  const tmp = Error.stackTraceLimit
  Error.stackTraceLimit = 0
  cb && cb(Error)
  Error.stackTraceLimit = tmp
}

export const basicChecker = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      AssignmentExpression(path, state) {
        const errors = state.file.get('errors')
        const rightType = resolveTSType(path.get('right').getTypeAnnotation())
        const leftBinding = path.scope.getBinding(path.get('left'))
        const leftType = resolveTSType(leftBinding.path.get('id').getTypeAnnotation())
        if (leftType !== rightType) {
          noStackTraceWrapper(Error => {
            errors.push(
              path
                .get('init')
                .buildCodeFrameError(`Assignment:${rightType} can not assign to ${leftType}`, Error)
            )
          })
        }
      },
      VariableDeclarator(path, state) {
        const errors = state.file.get('errors')
        const idType = resolveTSType(path.get('id').getTypeAnnotation())
        const initType =
          resolveTSType(path.get('init').getTypeAnnotation()) ??
          resolveJSType(path.get('init').type)
        if (initType && idType !== initType) {
          noStackTraceWrapper(Error => {
            errors.push(
              path
                .get('init')
                .buildCodeFrameError(`Variable:${initType} can not assign to ${idType}`, Error)
            )
          })
        }
      },
    },
    post(file) {
      console.log(file.get('errors'))
    },
  }
})
