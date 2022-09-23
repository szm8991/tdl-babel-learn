import { Parser, TokenType } from 'acorn'
Parser.acorn.keywordTypes['ming'] = new TokenType('ming', { keyword: 'ming' })

export function plugin(Parser) {
  return class extends Parser {
    parse(program) {
      let newKeywords =
        'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super'
      newKeywords += ' ming'
      this.keywords = new RegExp('^(?:' + newKeywords.replace(/ /g, '|') + ')$')
      return super.parse(program)
    }

    parseStatement(context, topLevel, exports) {
      var starttype = this.type
      if (starttype == Parser.acorn.keywordTypes['ming']) {
        var node = this.startNode()
        return this.parseMingStatement(node)
      } else {
        return super.parseStatement(context, topLevel, exports)
      }
    }

    parseMingStatement(node) {
      this.next()
      return this.finishNode({ value: 'ming' }, 'MingStatement') //新增加的ssh语句
    }
  }
}
