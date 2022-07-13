import { describe, expect, it } from 'vitest'
import { autoTrackPluginCode } from '../../src'
describe('should', () => {
  it('exported', () => {
    expect(autoTrackPluginCode).toMatchInlineSnapshot(`
      "// import tracker from 'tracker'
      import { tracking } from 'tracker';
      import aa from 'aa';
      import * as bb from 'bb';
      import { cc } from 'cc';
      import 'dd';

      function a() {
        console.log('aaa');
      }

      class B {
        bb() {
          return 'bbb';
        }

      }

      const c = () => {
        tracking();
        return 'ccc';
      };

      const d = function () {
        console.log('ddd');
      };"
    `)
  })
})
