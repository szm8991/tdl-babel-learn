import { declare } from '@babel/helper-plugin-utils'
export let forDirError = false
export let forDirectionLintError = null
export const forDirectionLintPlugin = declare((api, options, dirname) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('errors', [])
    },
    visitor: {
      ForStatement(path, state) {
        const errors = state.file.get('errors')
        const testOperator = path.node.test.operator
        const udpateOperator = path.node.update.operator

        let sholdUpdateOperator
        if (['<', '<='].includes(testOperator)) {
          sholdUpdateOperator = '++'
        } else if (['>', '>='].includes(testOperator)) {
          sholdUpdateOperator = '--'
        }

        if (sholdUpdateOperator !== udpateOperator) {
          forDirError = true
          const tmp = Error.stackTraceLimit
          Error.stackTraceLimit = 0
          errors.push(path.get('update').buildCodeFrameError('for direction error', Error))
          Error.stackTraceLimit = tmp
        }
      },
    },
    post(file) {
      forDirectionLintError = file.get('errors')
    },
  }
})
