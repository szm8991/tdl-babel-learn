import { describe, expect, it } from 'vitest'
import {
  autoTrackCode,
  importDeclarationVisitTime,
  importFunctionVisitTime,
  enterTime,
} from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(enterTime).toMatchInlineSnapshot('68')
    expect(importDeclarationVisitTime).toBe(1)
    expect(importFunctionVisitTime).toBe(4)
    expect(autoTrackCode).toMatchInlineSnapshot(`
      "// import tracker from 'tracker'
      import { tracking } from 'tracker';
      import aa from 'aa';
      import * as bb from 'bb';
      import { cc } from 'cc';
      import 'dd';

      function a() {
        tracking();
        console.log('aaa');
      }

      class B {
        bb() {
          tracking();
          return 'bbb';
        }

      }

      const c = () => {
        tracking();
        return 'ccc';
      };

      const d = function () {
        tracking();
        console.log('ddd');
      };"
    `)
  })
})
