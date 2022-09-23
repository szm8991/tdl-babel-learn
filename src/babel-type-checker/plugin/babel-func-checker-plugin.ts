import { declare } from '@babel/helper-plugin-utils'
const tsTypeAnnotationMap = {
  TSStringKeyword: 'string',
  TSNumberKeyword: 'number',
}
function typeEval(node, params) {
  let checkType
  if (node.checkType.type === 'TSTypeReference') {
    checkType = params[node.checkType.typeName.name]
  } else {
    checkType = resolveTSType(node.checkType)
  }
  const extendsType = resolveTSType(node.extendsType)
  // console.log(checkType, extendsType)
  // 根据extends是否成立返会不同分支，这里没实现ts中的extends逻辑，只是字面量的比较
  if (checkType === extendsType) {
    // console.log(node.trueType)
    return resolveTSType(node.trueType)
  } else {
    // console.log(node.falseType)
    return resolveTSType(node.falseType)
  }
}

function resolveTSType(targetType, referenceTypesMap = {}, scope?) {
  switch (targetType.type) {
    case 'TSTypeAnnotation':
      if (targetType.typeAnnotation.type === 'TSTypeReference') {
        return referenceTypesMap[targetType.typeAnnotation.typeName.name]
      }
      return tsTypeAnnotationMap[targetType.typeAnnotation.type]
    case 'NumberTypeAnnotation':
      return 'number'
    case 'StringTypeAnnotation':
      return 'string'
    case 'TSStringKeyword':
      return 'string'
    case 'TSNumberKeyword':
      return 'number'
    case 'TSTypeReference':
      const typeAlias = scope.getData(targetType.typeName.name)
      const paramTypes = targetType.typeParameters.params.map(item => {
        return resolveTSType(item)
      })
      const params = typeAlias.paramNames.reduce((obj, name, index) => {
        obj[name] = paramTypes[index]
        return obj
      }, {})
      return typeEval(typeAlias.body, params)
    case 'TSLiteralType':
      return targetType.literal.value
  }
}

function noStackTraceWrapper(cb) {
  const tmp = Error.stackTraceLimit
  Error.stackTraceLimit = 0
  cb && cb(Error)
  Error.stackTraceLimit = tmp
}
export let funcError = null
export const basicFuncChecker = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      TSTypeAliasDeclaration(path) {
        path.scope.setData(path.get('id').toString(), {
          paramNames: path.node.typeParameters.params.map(item => {
            return item.name
          }),
          body: path.getTypeAnnotation(),
        })
        path.scope.setData(path.get('params'))
      },
      CallExpression(path, state) {
        const errors = state.file.get('errors')
        // 调用时传入的ts参数类型，如果是类型运算需要计算后返回类型结果
        const realTypes = path.node.typeParameters?.params.map(item => {
          return resolveTSType(item, {}, path.scope)
        })
        // 调用时的参数类型
        const argumentsTypes = path.get('arguments').map(item => {
          return resolveTSType(item.getTypeAnnotation())
        })
        // 声明时的类型
        const calleeName = path.get('callee').toString()
        const functionDeclarePath = path.scope.getBinding(calleeName).path
        const realTypeMap = {}
        functionDeclarePath.node.typeParameters?.params.map((item, index) => {
          realTypeMap[item.name] = realTypes[index]
        })
        const declareParamsTypes = functionDeclarePath.get('params').map(item => {
          return resolveTSType(item.getTypeAnnotation(), realTypeMap)
        })
        // console.log(argumentsTypes)
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
      funcError = file.get('errors')
    },
  }
})
