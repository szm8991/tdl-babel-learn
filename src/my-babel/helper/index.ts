// ast类型对应的visitor及其他配置——不同AST的什么属性是可以遍历的
const astDefinationsMap = new Map()
astDefinationsMap.set('Program', {
  visitor: ['body'],
  isBlock: true,
})
astDefinationsMap.set('VariableDeclaration', {
  visitor: ['declarations'],
})
astDefinationsMap.set('VariableDeclarator', {
  visitor: ['id', 'init'],
})
astDefinationsMap.set('Identifier', {})
astDefinationsMap.set('NumericLiteral', {})
astDefinationsMap.set('FunctionDeclaration', {
  visitor: ['id', 'params', 'body'],
  isBlock: true,
})
astDefinationsMap.set('BlockStatement', {
  visitor: ['body'],
})
astDefinationsMap.set('ReturnStatement', {
  visitor: ['argument'],
})
astDefinationsMap.set('BinaryExpression', {
  visitor: ['left', 'right'],
})
astDefinationsMap.set('ExpressionStatement', {
  visitor: ['expression'],
})
astDefinationsMap.set('CallExpression', {
  visitor: ['callee', 'arguments'],
})

const validations = {}

// isxxExpression判断函数
for (let name of astDefinationsMap.keys()) {
  validations['is' + name] = function (node) {
    return node.type === name
  }
}

export const helper = {
  visitorKeys: astDefinationsMap,
  ...validations,
}
