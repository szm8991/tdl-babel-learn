import { declare } from '@babel/helper-plugin-utils'
import generate from '@babel/generator'
import fse from 'fs-extra'
import path from 'node:path'
// 计数intl index->const title = 'title' -> const title = _intl.t('intl1');
let intlIndex = 0
function nextIntlKey() {
  ++intlIndex
  return `intl${intlIndex}`
}
// 保存intl key->value -> { key: 'intl1', value: 'title' },
function save(file, key, value) {
  const allText = file.get('allText')
  allText.push({
    key,
    value,
  })
  file.set('allText', allText)
}

export let shouldNotI18n = 0
export const autoI18nPlugin = declare((api, options, dirname) => {
  api.assertVersion(7)

  if (!options.outputDir) {
    throw new Error('outputDir in empty')
  }

  function getReplaceExpression(path, value, intlUid) {
    const expressionParams = path.isTemplateLiteral()
      ? path.node.expressions.map(item => {
          const code = generate(item).code
          // console.log(code)
          return code
        })
      : null
    let replaceExpression = api.template.ast(
      `${intlUid}.t('${value}'${expressionParams ? ',' + expressionParams.join(',') : ''})`
    ).expression
    if (
      path.findParent(p => p.isJSXAttribute()) &&
      !path.findParent(p => p.isJSXExpressionContainer())
    ) {
      replaceExpression = api.types.JSXExpressionContainer(replaceExpression)
    }
    return replaceExpression
  }

  return {
    pre(file) {
      // 设置一个存储i18n文本的数组
      file.set('allText', [])
    },
    visitor: {
      Program: {
        enter(path, state) {
          let imported
          //  for import intl
          path.traverse({
            ImportDeclaration(curPath) {
              const source = curPath.node.source.value
              if (source === 'intl') {
                imported = true
              }
            },
          })
          if (!imported) {
            const uid = path.scope.generateUid('intl')
            const importAst = api.template.ast(`import ${uid} from 'intl'`)
            path.node.body.unshift(importAst)
            state.intlUid = uid
          }
          //  for skip some importNode commentNode
          path.traverse({
            'StringLiteral|TemplateLiteral'(curPath) {
              if (curPath.node.leadingComments) {
                curPath.node.leadingComments = curPath.node.leadingComments.filter(
                  (comment, index) => {
                    if (comment.value.includes('i18n-disable')) {
                      curPath.node.skipTransform = true
                      return false
                    }
                    return true
                  }
                )
              }
              // 当前是模块导入，不应该国际化
              if (curPath.findParent(p => p.isImportDeclaration())) {
                curPath.node.skipTransform = true
              }
              // jsx中的pure className应该也不国际化
              if (curPath.findParent(p => p.isJSXAttribute())) {
                if (curPath.findParent(p => p.isJSXAttribute()).node.name.name === 'className') {
                  // console.log('get it')
                  curPath.node.skipTransform = true
                }
              }
            },
          })
        },
      },
      StringLiteral(path, state) {
        if (path.node.skipTransform) {
          shouldNotI18n++
          return
        }
        let key = nextIntlKey()
        save(state.file, key, path.node.value)

        const replaceExpression = getReplaceExpression(path, key, state.intlUid)
        path.replaceWith(replaceExpression)
        path.skip()
      },
      TemplateLiteral(path, state) {
        if (path.node.skipTransform) {
          shouldNotI18n++
          return
        }
        const value = path
          .get('quasis')
          .map(item => item.node.value.raw)
          .join('{placeholder}')
        if (value) {
          // console.log(value)
          let key = nextIntlKey()
          save(state.file, key, value)

          const replaceExpression = getReplaceExpression(path, key, state.intlUid)
          path.replaceWith(replaceExpression)
          path.skip()
        }
      },
    },
    post(file) {
      const allText = file.get('allText')
      // console.log(allText)
      const intlData = allText.reduce((obj, item) => {
        obj[item.key] = item.value
        return obj
      }, {})

      const content = `const resource = ${JSON.stringify(
        intlData,
        null,
        4
      )};\nexport default resource;`
      fse.ensureDirSync(options.outputDir)
      fse.writeFileSync(path.join(options.outputDir, 'zh_CN.js'), content)
      fse.writeFileSync(path.join(options.outputDir, 'en_US.js'), content)
    },
  }
})
