import { describe, expect, it } from 'vitest'
import { autoTrackCode, importDeclarationVisitTime } from '../../src'

describe('should', () => {
  it('exported', () => {
    expect(importDeclarationVisitTime).toBe(1)
    expect(autoTrackCode).toMatchInlineSnapshot(`
      "import tracker from 'tracker';
      import aa from 'aa';
      import * as bb from 'bb';
      import { cc } from 'cc';
      import 'dd';

      function a() {
        tracker();
        console.log('aaa');
      }

      class B {
        bb() {
          tracker();
          return 'bbb';
        }

      }

      const c = () => {
        tracker();
        return 'ccc';
      };

      const d = function () {
        tracker();
        console.log('ddd');
      };"
    `)
  })
})
