import { declare } from '@babel/helper-plugin-utils'
import generate from '@babel/generator'
import fse from 'fs-extra'
import path from 'node:path'
import doctrine from 'doctrine'
import renderer from './renderer'
export let docs
// 将ts ast转化为js ast
function resolveType(tsType) {
  const typeAnnotation = tsType.typeAnnotation ? tsType.typeAnnotation : tsType
  if (!typeAnnotation) {
    return
  }
  switch (typeAnnotation.type) {
    case 'TSStringKeyword':
      return 'string'
    case 'TSNumberKeyword':
      return 'number'
    case 'TSBooleanKeyword':
      return 'boolean'
  }
}

// 解析注释里的 @xxx 信息
function parseComment(commentStr) {
  if (!commentStr) {
    return
  }
  return doctrine.parse(commentStr, {
    unwrap: true,
  })
}
// 根据样式输出格式化后的文档
function generate(docs, format = 'json') {
  if (format === 'markdown') {
    return {
      ext: '.md',
      content: renderer.markdown(docs),
    }
  } else if (format === 'html') {
    return {
      ext: 'html',
      content: renderer.html(docs),
    }
  } else {
    return {
      ext: 'json',
      content: renderer.json(docs),
    }
  }
}

export const autoDocPlugin = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('docs', [])
    },
    visitor: {
      FunctionDeclaration(path, state) {
        const docs = state.file.get('docs')
        docs.push({
          type: 'function',
          // function name
          name: path.get('id').toString(),
          // function parmas
          params: path.get('params').map(paramPath => {
            return {
              name: paramPath.toString(),
              type: resolveType(paramPath.getTypeAnnotation()),
            }
          }),
          // return type——babel有bug？——同样的api取回的结构不同
          return: resolveType(path.get('returnType').getTypeAnnotation()),
          doc: path.node.leadingComments && parseComment(path.node.leadingComments[0].value),
        })
      },
      ClassDeclaration(path, state) {
        const docs = state.file.get('docs')
        const classInfo: any = {
          type: 'class',
          name: path.get('id').toString(),
          constructorInfo: {},
          methodsInfo: [],
          propertiesInfo: [],
        }
        if (path.node.leadingComments) {
          classInfo.doc = parseComment(path.node.leadingComments[0].value)
        }
        path.traverse({
          ClassProperty(path) {
            classInfo.propertiesInfo.push({
              name: path.get('key').toString(),
              type: resolveType(path.getTypeAnnotation()),
              doc: [path.node.leadingComments, path.node.trailingComments]
                .filter(Boolean)
                .map(comments => {
                  return comments.map(comment => {
                    return parseComment(comment.value)
                  })
                })
                .filter(Boolean),
            })
          },
          ClassMethod(path) {
            if (path.node.kind === 'constructor') {
              classInfo.constructorInfo = {
                params: path.get('params').map(paramPath => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation()),
                    doc:
                      path.node.leadingComments && parseComment(path.node.leadingComments[0].value),
                  }
                }),
              }
            } else {
              classInfo.methodsInfo.push({
                name: path.get('key').toString(),
                doc: parseComment(path.node.leadingComments[0].value),
                params: path.get('params').map(paramPath => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation()),
                  }
                }),
                return: resolveType(path.getTypeAnnotation()),
              })
            }
          },
        })
        docs.push(classInfo)
        state.file.set('docs', docs)
      },
    },
    post(file) {
      docs = file.get('docs')
      const res = generate(docs, options.format)
      fse.ensureDirSync(options.outputDir)
      fse.writeFileSync(path.join(options.outputDir, 'docs' + res.ext), res.content)
    },
  }
})
