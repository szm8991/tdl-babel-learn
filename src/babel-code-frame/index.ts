import { codeFrameColumns } from '@babel/code-frame'

const code = `
const a = 1;
const b = 2;
console.log(a + b);
`

export const res = codeFrameColumns(
  code,
  {
    start: { line: 2, column: 1 },
    end: { line: 3, column: 5 },
  },
  {
    highlightCode: true,
    message: '这里出错了',
  }
)

// console.log(res)
