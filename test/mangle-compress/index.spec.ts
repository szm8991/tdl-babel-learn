import { describe, expect, it } from 'vitest'
import { mangleCompressCode } from '../../src'

describe('should', () => {
  it('code result', () => {
    expect(mangleCompressCode).toMatchInlineSnapshot(`
      "function _g() {
        const _c = 1;
        const _d = 2;

        _f(3, 4);

        console.log(_d);
        return _d;

        function _f(_a, _b) {
          return _a + _b;
        }
      }

      _g();"
    `)
  })
})
