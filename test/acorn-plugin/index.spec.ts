import { describe, expect, it } from 'vitest'
import { res } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(res).toMatchInlineSnapshot(`
      "  1 |
      > 2 | const a = 1;
          | ^^^^^^^^^^^^
      > 3 | const b = 2;
          | ^^^^^ 这里出错了
        4 | console.log(a + b);
        5 |"
    `)
  })
})
