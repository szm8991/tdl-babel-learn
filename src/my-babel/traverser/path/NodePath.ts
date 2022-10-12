import { helper } from '../../helper'
import { Scope } from './scope'
import { myTraverse } from '../index'
import { myGenerate } from '../../generator'

// path 保存当前节点和父节点，并且能够拿到节点，可以基于节点来提供一系列增删改的 api
export class NodePath {
  private __scope: any
  constructor(public node, public parent, public parentPath, public key, public listKey) {
    this.node = node
    this.parent = parent
    this.parentPath = parentPath
    this.key = key
    this.listKey = listKey

    Object.keys(helper).forEach(key => {
      if (key.startsWith('is')) {
        this[key] = helper[key].bind(this, node)
      }
    })
  }
  // 所在的作用域
  get scope() {
    if (this.__scope) {
      return this.__scope
    }
    const isBlock = this.isBlock()
    const parentScope = this.parentPath && this.parentPath.scope
    return (this.__scope = isBlock ? new Scope(parentScope, this) : parentScope)
  }

  skip() {
    this.node.__shouldSkip = true
  }

  isBlock() {
    return helper.visitorKeys.get(this.node.type).isBlock
  }

  replaceWith(node) {
    // 是一个Node数组，替换listKey位置节点
    if (this.listKey != undefined) {
      this.parent[this.key].splice(this.listKey, 1, node)
    } else {
      this.parent[this.key] = node
    }
  }
  remove() {
    if (this.listKey != undefined) {
      this.parent[this.key].splice(this.listKey, 1)
    } else {
      this.parent[this.key] = null
    }
  }
  // 顺着 path 链向上查找 AST，并且把节点传入回调函数
  findParent(callback) {
    let curPath = this.parentPath
    while (curPath && !callback(curPath)) {
      curPath = curPath.parentPath
    }
    return curPath
  }
  find(callback) {
    let curPath = this
    while (curPath && !callback(curPath)) {
      curPath = curPath.parentPath
    }
    return curPath
  }

  traverse(visitors) {
    const defination = helper.visitorKeys.get(this.node.type)

    if (defination.visitor) {
      defination.visitor.forEach(key => {
        const prop = this.node[key]
        if (Array.isArray(prop)) {
          // 如果该属性是数组
          prop.forEach((childNode, index) => {
            myTraverse(childNode, visitors, this.node, this)
          })
        } else {
          myTraverse(prop, visitors, this.node, this)
        }
      })
    }
  }
  toString() {
    return myGenerate(this.node).code
  }
}
