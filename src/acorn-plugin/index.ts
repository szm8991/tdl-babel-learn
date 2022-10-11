import { Parser } from 'acorn'
import { plugin } from './plugin'
const newParser = Parser.extend(plugin as any)

const program = `
    ming
    const a = 1
`

export const mingAst = newParser.parse(program, { ecmaVersion: 'latest' })
