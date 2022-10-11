import { Parser } from 'acorn'
import { literal, ming } from './plugin'
const syntaxPlugins = {
  literal,
  ming,
}

const defaultOptions = {
  plugins: [],
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
