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

function noStackTraceWrapper(cb) {
  const tmp = Error.stackTraceLimit
  Error.stackTraceLimit = 0
  cb && cb(Error)
  Error.stackTraceLimit = tmp
}

export const basicFuncChecker = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        // 声明时的类型
        const argumentsTypes = path.get('arguments').map(item => {
          return resolveTSType(item.getTypeAnnotation())
        })
        // 调用时的类型
        const calleeName = path.get('callee').toString()
        const functionDeclarePath = path.scope.getBinding(calleeName).path
        const declareParamsTypes = functionDeclarePath.get('params').map(item => {
          return resolveTSType(item.getTypeAnnotation())
        })
        argumentsTypes.forEach((item, index) => {
          if (item !== declareParamsTypes[index]) {
            noStackTraceWrapper(Error => {
              errors.push(
                path
                  .get('arguments.' + index)
                  .buildCodeFrameError(
                    `${item} can not assign to ${declareParamsTypes[index]}`,
                    Error
                  )
              )
            })
          }
        })
      },
    },
    post(file) {
      console.log(file.get('errors'))
    },
  }
})
