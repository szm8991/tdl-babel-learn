import { declare } from '@babel/helper-plugin-utils'
function canExistAfterCompletion(path) {
  return (
    path.isFunctionDeclaration() ||
    path.isVariableDeclaration({
      kind: 'var',
    })
  )
}
export const compressPlugin = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('uid', 0)
    },
    visitor: {
      BlockStatement(path) {
        const statementPaths = path.get('body')
        let purge = false
        for (let i = 0; i < statementPaths.length; i++) {
          // 判断是否是CompletionStatement别名里的词法语句
          if (statementPaths[i].isCompletionStatement()) {
            purge = true
            continue
          }
          // 删除语法完结意义后面的执行表达式
          if (purge && !canExistAfterCompletion(statementPaths[i])) {
            statementPaths[i].remove()
          }
        }
      },
      Scopable(path) {
        Object.entries(path.scope.bindings).forEach(([key, binding]: any[]) => {
          // 没有被引用
          if (!binding.referenced) {
            if (binding.path.get('init').isCallExpression()) {
              // 拿到节点前的注释
              const comments = binding.path.get('init').node.leadingComments
              if (comments && comments[0]) {
                // 有 PURE 注释就删除
                if (comments[0].value.includes('PURE')) {
                  binding.path.remove()
                  return
                }
              }
            }
            // 如果是纯函数，就直接删除，否则替换为右边部分
            if (!path.scope.isPure(binding.path.node.init)) {
              binding.path.parentPath.replaceWith(
                api.types.expressionStatement(binding.path.node.init)
              )
            } else {
              binding.path.remove()
            }
          }
        })
      },
    },
  }
})
