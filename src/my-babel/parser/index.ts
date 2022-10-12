import { Parser } from 'acorn'
import { literal } from './plugin'
const syntaxPlugins = {
  literal,
}

const defaultOptions = {
  plugins: [],
  ecmaVersion: 'latest',
}

export function myParse(code, options) {
  const resolvedOptions = Object.assign({}, defaultOptions, options)
  const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
    let plugin = syntaxPlugins[pluginName]
    return plugin ? Parser.extend(plugin) : Parser
  }, Parser)
  return newParser.parse(code, {
    locations: true,
  })
}
