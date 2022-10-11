class Binding {
  referenced: any
  referencePaths: any[]
  constructor(public id, public path, public scope?, public kind?) {
    this.id = id
    this.path = path
    this.referenced = false
    this.referencePaths = []
  }
}
export class Scope {
  parent: any
  bindings: any
  constructor(public parentScope, public path) {
    this.parent = parentScope
    this.bindings = {}
    this.path = path
    // 扫描作用域中所有的声明，记录到 scope
    path.traverse({
      VariableDeclarator: childPath => {
        this.registerBinding(childPath.node.id.name, childPath)
      },
      FunctionDeclaration: childPath => {
        childPath.skip()
        this.registerBinding(childPath.node.id.name, childPath)
      },
    })
    // 扫描所有引用该 binding 的地方
    path.traverse({
      Identifier: childPath => {
        if (!childPath.findParent(p => p.isVariableDeclarator() || p.isFunctionDeclaration())) {
          const id = childPath.node.name
          const binding = this.getBinding(id)
          if (binding) {
            binding.referenced = true
            binding.referencePaths.push(childPath)
          }
        }
      },
    })
  }

  registerBinding(id, path) {
    this.bindings[id] = new Binding(id, path)
  }

  getOwnBinding(id) {
    return this.bindings[id]
  }

  getBinding(id) {
    let res = this.getOwnBinding(id)
    if (res === undefined && this.parent) {
      res = this.parent.getOwnBinding(id)
    }
    return res
  }

  hasBinding(id) {
    return !!this.getBinding(id)
  }
}
