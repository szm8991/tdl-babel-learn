import parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import types from '@babel/types'
import { parse } from '@vue/compiler-sfc'
const vueCode = `
<script setup lang="ts">
  console.log(1);

  function func() {
      console.info(2);
  }
  </script>

<template>
  <div>hi,vue3-template-magic</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
`
// @vue/compiler-sfc
const {
  descriptor: { template },
} = parse(vueCode)
// console.log('vue-sfc：' + template!.ast)
const reactCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`
//@babel/parser
const ast = parser.parse(reactCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
})
// console.log('babel：' + ast)
traverse(ast, {
  CallExpression(path, state) {
    // console.log(path.node.callee)
    // console.log(generate(path.node.callee))
    if (
      types.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'console' &&
      ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start
      path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
    }
  },
})

export const { code } = generate(ast)
export * from './plugin'
