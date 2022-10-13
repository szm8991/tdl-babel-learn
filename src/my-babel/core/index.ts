import { myParse } from '../parser'
import { myTraverse } from '../traverser'
import { myGenerate } from '../generator'

function template(code) {
  return myParse(code, {
    plugins: ['literal'],
  })
}
template.expression = function (code) {
  const node = template(code).body[0].expression
  node.loc = null
  return node
}

export function myTransformSync(code, options) {
  const ast = myParse(code, options.parserOpts)

  const pluginApi = {
    template,
  }
  const visitors = {}
  // 调用options.plugin函数，将返回的plugin和默认配置项合并
  options.plugins &&
    options.plugins.forEach(([plugin, options]) => {
      const res = plugin(pluginApi, options)
      Object.assign(visitors, res.visitor)
    })

  options.presets &&
    options.presets.reverse().forEach(([preset, options]) => {
      const plugins = preset(pluginApi, options)
      plugins.forEach(([plugin, options]) => {
        const res = plugin(pluginApi, options)
        Object.assign(visitors, res.visitor)
      })
    })

  myTraverse(ast, visitors)
  return myGenerate(ast, code, options.fileName)
}
