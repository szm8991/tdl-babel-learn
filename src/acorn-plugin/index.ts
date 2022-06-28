import { Parser } from 'acorn'
import { plugin } from './plugin'
const newParser = Parser.extend(plugin)

var program = `
    ming
    const a = 1
`

export const ast = newParser.parse(program)
